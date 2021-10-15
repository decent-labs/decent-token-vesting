import { useState, useEffect, useCallback } from 'react';
import { BigNumber } from 'ethers';
import { GeneralTokenVesting } from '../../contracts/typechain';
import { VestStartedEvent } from '../../contracts/typechain/GeneralTokenVesting';
import { useWeb3 } from '../web3';

export type VestId = {
  id: string,
  token: string,
  beneficiary: string,
  creator: string,
}

type LocalStorageVests = {
  [chainId: number]: {
    syncedUntilBlock: number,
    ids: VestId[],
  },
}

const useVestIds = (generalTokenVesting: GeneralTokenVesting | undefined, deploymentBlock: number | undefined, currentBlock: number | undefined) => {
  const { chainId } = useWeb3();
  const [vestIds, setVestIds] = useState<VestId[]>([]);
  const [vestIdsLoading, setVestIdsLoading] = useState(true);

  const [queryPageSize] = useState(10000);
  const [syncing, setSyncing] = useState(true);
  const [syncToBlock, setSyncToBlock] = useState<number>();
  const [syncedUntilBlock, setSyncedUntilBlock] = useState<number>();

  const addVestIdsToLocalStorage = useCallback((vestIds: VestId[]) => {
    // given an array of new vest ids, add them to local storage if they're not already there
    // also add those vest ids into our in-memory state

    if (!chainId || !deploymentBlock) {
      return;
    }

    let dataString = localStorage.getItem("vests");
    if (!dataString) {
      dataString = JSON.stringify({ [chainId]: { syncedUntilBlock: deploymentBlock, ids: [] } });
    }

    const data = JSON.parse(dataString) as LocalStorageVests;

    if (!data[chainId]) {
      data[chainId] = { syncedUntilBlock: deploymentBlock, ids: [] };
    }

    const newIds = vestIds.filter(id => {
      return !data[chainId].ids.some(v => v.id === id.id);
    });

    if (newIds.length === 0) {
      return;
    }

    data[chainId].ids = [...data[chainId].ids, ...newIds];

    localStorage.setItem("vests", JSON.stringify(data));

    setVestIds(data[chainId].ids);
  }, [chainId, deploymentBlock]);

  const removeVestIdsFromLocalStorage = useCallback((vestIds: VestId[]) => {
    // given an array of invalid vestIds (as identified upstream via checking the contract)
    // remove them from local storage and update our in-memory state

    if (!chainId) {
      return;
    }

    let dataString = localStorage.getItem("vests");
    if (!dataString) {
      return;
    }

    const data = JSON.parse(dataString) as LocalStorageVests;

    if (!data[chainId]) {
      return;
    }

    const noBadItems = data[chainId].ids.filter(id => {
      return !vestIds.some(v => v.id === id.id);
    });

    data[chainId].ids = noBadItems;

    localStorage.setItem("vests", JSON.stringify(data));

    setVestIds(noBadItems);
  }, [chainId]);

  const updateSyncedUntilInLocalStorage = useCallback((syncedUntilBlock: number) => {
    // update local storage and in-memory store with our currently synced until block number

    if (!chainId) {
      return;
    }

    let dataString = localStorage.getItem("vests");
    if (!dataString) {
      dataString = JSON.stringify({ [chainId]: { syncedUntilBlock: syncedUntilBlock, ids: [] } });
    }

    const data = JSON.parse(dataString) as LocalStorageVests;

    if (!data[chainId]) {
      data[chainId] = { syncedUntilBlock: syncedUntilBlock, ids: [] };
    }

    data[chainId].syncedUntilBlock = syncedUntilBlock;

    localStorage.setItem("vests", JSON.stringify(data));

    setSyncedUntilBlock(syncedUntilBlock);
  }, [chainId]);

  const addVest = useCallback((_: string, __: string, ___: BigNumber, vestEvent: VestStartedEvent) => {
    vestEvent.getTransaction()
      .then(transaction => {
        const newVestId = {
          id: `${vestEvent.args.token}-${vestEvent.args.beneficiary}`,
          token: vestEvent.args.token,
          beneficiary: vestEvent.args.beneficiary,
          creator: transaction.from,
        };

        addVestIdsToLocalStorage([newVestId]);

        if (transaction.blockNumber && !syncing) {
          updateSyncedUntilInLocalStorage(transaction.blockNumber);
        }
      })
      .catch(console.error);
  }, [addVestIdsToLocalStorage, syncing, updateSyncedUntilInLocalStorage]);

  const addVests = useCallback((vestEvents: VestStartedEvent[]) => {
    return Promise.all(vestEvents.map(vestEvent => Promise.all([vestEvent, vestEvent.getTransaction()])))
      .then(vests => {
        const newVests = vests
          .map(([vestEvent, transaction]) => ({
            id: `${vestEvent.args.token}-${vestEvent.args.beneficiary}`,
            token: vestEvent.args.token,
            beneficiary: vestEvent.args.beneficiary,
            creator: transaction.from,
          }));

        if (newVests.length > 0) {
          addVestIdsToLocalStorage(newVests);
        }
      })
  }, [addVestIdsToLocalStorage]);

  useEffect(() => {
    // this is so that when bulk syncing, we know where to stop (current block)

    if (syncToBlock !== undefined) {
      return;
    }

    if (!currentBlock) {
      setSyncToBlock(undefined);
      return;
    }

    setSyncToBlock(currentBlock);
  }, [syncToBlock, currentBlock]);

  useEffect(() => {
    // keeps track of syncing status

    if (!syncToBlock || !syncedUntilBlock) {
      setSyncing(true);
      return;
    }

    if (syncToBlock === syncedUntilBlock) {
      setSyncing(false);
    }
  }, [syncToBlock, syncedUntilBlock]);

  useEffect(() => {
    // this runs on first load to grab our highest synced block from local storage,
    // to use as our floor for bulk syncing

    if (
      syncedUntilBlock !== undefined ||
      chainId === undefined ||
      deploymentBlock === undefined
    ) {
      return;
    }

    let dataString = localStorage.getItem("vests");
    if (!dataString) {
      setSyncedUntilBlock(deploymentBlock - 1);
      return;
    }

    const data = JSON.parse(dataString) as LocalStorageVests;

    if (!data[chainId]) {
      setSyncedUntilBlock(deploymentBlock - 1);
      return;
    }

    setSyncedUntilBlock(data[chainId].syncedUntilBlock);
  }, [chainId, deploymentBlock, syncedUntilBlock]);

  useEffect(() => {
    // this runs on first load, to grab any data in localstorage, and load those vests into the app

    if (!chainId || !generalTokenVesting) {
      return;
    }

    let existingDataString = localStorage.getItem("vests");
    if (!existingDataString) {
      setVestIdsLoading(false);
      return;
    }

    const data = JSON.parse(existingDataString) as LocalStorageVests;

    if (!data[chainId]) {
      setVestIdsLoading(false);
      return;
    }

    setVestIdsLoading(true);

    Promise.all(data[chainId].ids.map(id => Promise.all([id, generalTokenVesting.getStart(id.token, id.beneficiary)])))
      .then(startTimes => {
        const valid = startTimes.filter(([, startTime]) => startTime.gt(0));
        const invalid = startTimes.filter(([, startTime]) => startTime.eq(0));

        if (invalid.length > 0) {
          removeVestIdsFromLocalStorage(invalid.map(([id]) => id));
        }

        setVestIds(valid.map(([id]) => id));
      })
      .catch(console.error)
      .finally(() => setVestIdsLoading(false));
  }, [chainId, generalTokenVesting, removeVestIdsFromLocalStorage]);

  useEffect(() => {
    // this keeps our "synced to block" status up to date as new blocks come in

    if (syncing || !chainId || !currentBlock) {
      return;
    }

    updateSyncedUntilInLocalStorage(currentBlock);
  }, [chainId, currentBlock, syncing, updateSyncedUntilInLocalStorage]);

  useEffect(() => {
    // the bulk sync logic, which rolls through past blocks looking for VestStarted events

    if (
      generalTokenVesting === undefined ||
      deploymentBlock === undefined ||
      chainId === undefined ||
      syncToBlock === undefined ||
      syncedUntilBlock === undefined ||
      syncing === false ||
      syncToBlock === syncedUntilBlock
    ) {
      return;
    }

    let startBlock = syncedUntilBlock + 1;
    let endBlock = syncedUntilBlock + queryPageSize;
    if (endBlock > syncToBlock) {
      endBlock = syncToBlock;
    }

    generalTokenVesting.queryFilter(generalTokenVesting.filters.VestStarted(), startBlock, endBlock)
      .then(newVests => addVests(newVests))
      .then(() => updateSyncedUntilInLocalStorage(endBlock))
      .catch(console.error);
  }, [addVests, chainId, deploymentBlock, generalTokenVesting, queryPageSize, syncToBlock, syncedUntilBlock, syncing, updateSyncedUntilInLocalStorage]);

  useEffect(() => {
    // sets up a listener so that we can process new vests

    if (!generalTokenVesting || !chainId) {
      return;
    }

    const filter = generalTokenVesting.filters.VestStarted();
    generalTokenVesting.on(filter, addVest);

    return () => {
      generalTokenVesting.off(filter, addVest);
    }
  }, [addVest, chainId, generalTokenVesting]);

  return [vestIds, syncedUntilBlock || 0, syncing || vestIdsLoading] as const;
}

export {
  useVestIds,
}
