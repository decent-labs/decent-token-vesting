import { useState, useEffect, useCallback } from 'react';
import { BigNumber } from 'ethers';
import { GeneralTokenVesting } from '../../contracts/typechain';
import { TypedEventFilter } from '../../contracts/typechain/common';
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
  const [syncedToBlock, setSyncedToBlock] = useState<number>();

  const [allVestsFilter, setAllVestsFilter] = useState<TypedEventFilter<[string, string, BigNumber], { token: string; beneficiary: string; amount: BigNumber; }>>();

  useEffect(() => {
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
    if (!generalTokenVesting) {
      setAllVestsFilter(undefined);
      return;
    }

    setAllVestsFilter(generalTokenVesting.filters.VestStarted());
  }, [generalTokenVesting]);

  useEffect(() => {
    if (!syncToBlock || !syncedToBlock) {
      setSyncing(true);
      return;
    }

    if (syncToBlock === syncedToBlock) {
      setSyncing(false);
    }
  }, [syncToBlock, syncedToBlock]);

  useEffect(() => {
    if (
      syncedToBlock !== undefined ||
      chainId === undefined ||
      deploymentBlock === undefined
    ) {
      return;
    }

    let dataString = localStorage.getItem("vests");
    if (!dataString) {
      setSyncedToBlock(deploymentBlock - 1);
      return;
    }

    const data = JSON.parse(dataString) as LocalStorageVests;

    if (!data[chainId]) {
      setSyncedToBlock(deploymentBlock - 1);
      return;
    }

    setSyncedToBlock(data[chainId].syncedUntilBlock);
  }, [chainId, deploymentBlock, syncedToBlock]);

  const addVestIdsToLocalStorage = useCallback((chainId: number, vestIds: VestId[]) => {
    let dataString = localStorage.getItem("vests");
    if (!dataString) {
      dataString = JSON.stringify({ [chainId]: { syncedUntilBlock: deploymentBlock, ids: vestIds } });
    }

    const data = JSON.parse(dataString) as LocalStorageVests;

    const newIds = vestIds.filter(id => {
      return !data[chainId].ids.some(v => v.id === id.id);
    });

    if (newIds.length === 0) {
      return;
    }

    data[chainId].ids = [...data[chainId].ids, ...newIds];

    localStorage.setItem("vests", JSON.stringify(data));

    setVestIds(data[chainId].ids);
  }, [deploymentBlock]);

  const removeVestIdsFromLocalStorage = useCallback((chainId: number, vestIds: VestId[]) => {
    let dataString = localStorage.getItem("vests");
    if (!dataString) {
      return;
    }

    const data = JSON.parse(dataString) as LocalStorageVests;

    const noBadItems = data[chainId].ids.filter(id => {
      return !vestIds.some(v => v.id === id.id);
    });

    data[chainId].ids = noBadItems;

    localStorage.setItem("vests", JSON.stringify(data));

    setVestIds(noBadItems);
  }, []);

  const updateSyncedUntilInLocalStorage = useCallback((chainId: number, syncedUntilBlock: number) => {
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

    setSyncedToBlock(syncedUntilBlock);
  }, []);

  useEffect(() => {
    if (syncing || !chainId || !currentBlock) {
      return;
    }

    updateSyncedUntilInLocalStorage(chainId, currentBlock);
  }, [chainId, currentBlock, syncing, updateSyncedUntilInLocalStorage]);

  useEffect(() => {
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
          removeVestIdsFromLocalStorage(chainId, invalid.map(([id]) => id));
        }

        setVestIds(valid.map(([id]) => id));
      })
      .catch(console.error)
      .finally(() => setVestIdsLoading(false));
  }, [chainId, generalTokenVesting, removeVestIdsFromLocalStorage]);

  const addVests = useCallback((vestEvents: VestStartedEvent[], chainId: number) => {
    Promise.all(vestEvents.map(vestEvent => Promise.all([vestEvent, vestEvent.getTransaction()])))
      .then(vests => {
        const newVests = vests
          .map(([vestEvent, transaction]) => ({
            id: `${vestEvent.args.token}-${vestEvent.args.beneficiary}`,
            token: vestEvent.args.token,
            beneficiary: vestEvent.args.beneficiary,
            creator: transaction.from,
          }));

        addVestIdsToLocalStorage(chainId, newVests);
      })
      .catch(console.error);
  }, [addVestIdsToLocalStorage]);

  useEffect(() => {
    if (
      generalTokenVesting === undefined ||
      deploymentBlock === undefined ||
      chainId === undefined ||
      syncToBlock === undefined ||
      syncedToBlock === undefined ||
      allVestsFilter === undefined ||
      syncing === false ||
      syncToBlock === syncedToBlock
    ) {
      return;
    }

    let startBlock = syncedToBlock + 1;
    let endBlock = syncedToBlock + queryPageSize;
    if (endBlock > syncToBlock) {
      endBlock = syncToBlock;
    }

    generalTokenVesting.queryFilter(allVestsFilter, startBlock, endBlock)
      .then(newVests => {
        if (newVests.length > 0) {
          addVests(newVests, chainId);
        }
        updateSyncedUntilInLocalStorage(chainId, endBlock);
      })
      .catch(console.error);
  }, [addVestIdsToLocalStorage, allVestsFilter, chainId, syncToBlock, deploymentBlock, generalTokenVesting, syncing, queryPageSize, syncedToBlock, updateSyncedUntilInLocalStorage, addVests]);

  const addVest = useCallback((chainId: number) => {
    return (_: string, __: string, ___: BigNumber, vestEvent: VestStartedEvent) => {
      vestEvent.getTransaction()
        .then(transaction => {
          const newVestId = {
            id: `${vestEvent.args.token}-${vestEvent.args.beneficiary}`,
            token: vestEvent.args.token,
            beneficiary: vestEvent.args.beneficiary,
            creator: transaction.from,
          };
          addVestIdsToLocalStorage(chainId, [newVestId]);
          if (transaction.blockNumber && !syncing) {
            updateSyncedUntilInLocalStorage(chainId, transaction.blockNumber);
          }
        })
        .catch(console.error);
    }
  }, [addVestIdsToLocalStorage, syncing, updateSyncedUntilInLocalStorage]);

  useEffect(() => {
    if (!generalTokenVesting || !allVestsFilter || !chainId) {
      return;
    }

    const addVestCallback = addVest(chainId);
    generalTokenVesting.on(allVestsFilter, addVestCallback);

    return () => {
      generalTokenVesting.off(allVestsFilter, addVestCallback);
    }
  }, [allVestsFilter, generalTokenVesting, chainId, addVestIdsToLocalStorage, updateSyncedUntilInLocalStorage, syncing, addVest]);

  return [vestIds, syncedToBlock || 0, syncing || vestIdsLoading] as const;
}

export {
  useVestIds,
}
