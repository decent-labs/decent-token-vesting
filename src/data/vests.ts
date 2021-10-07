import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { GeneralTokenVesting } from '../../contracts/typechain';
import { TypedEventFilter } from '../../contracts/typechain/common';
import { VestStartedEvent } from '../../contracts/typechain/GeneralTokenVesting';
import { useWeb3 } from '../web3';

const useAllVests = (generalTokenVesting: GeneralTokenVesting | undefined, deploymentBlock: number | undefined) => {
  const { provider } = useWeb3();
  const [allVests, setAllVests] = useState<VestStartedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [queryPageSize] = useState(10000);
  const [endBlock, setEndBlock] = useState<number>();
  const [allVestsFilter, setAllVestsFilter] = useState<TypedEventFilter<[string, string, BigNumber], { token: string; beneficiary: string; amount: BigNumber; }>>();

  useEffect(() => {
    if (!provider) {
      setEndBlock(undefined);
      return;
    }

    if (endBlock !== undefined) {
      return;
    }

    provider.getBlockNumber()
      .then(setEndBlock)
      .catch(console.error);
  }, [endBlock, provider]);

  useEffect(() => {
    if (!generalTokenVesting) {
      setAllVestsFilter(undefined);
      return;
    }

    setAllVestsFilter(generalTokenVesting.filters.VestStarted());
  }, [generalTokenVesting]);

  useEffect(() => {
    if (endBlock === undefined || deploymentBlock === undefined) {
      setLoading(true);
      return;
    }

    if (endBlock === deploymentBlock) {
      setLoading(false);
    }
  }, [endBlock, deploymentBlock]);

  const addVest = (newVest: VestStartedEvent, _: any) => {
    setAllVests(allVests => {
      const newAllVests = [newVest, ...(allVests || [])];
      return newAllVests;
    });
  }

  const addVests = (newVests: VestStartedEvent[]) => {
    setAllVests(allVests => {
      const newVestsSorted = newVests.sort((a, b) => b.blockNumber - a.blockNumber);
      const newAllVests = [...(allVests || []), ...newVestsSorted];
      return newAllVests;
    });
  }

  useEffect(() => {
    if (!generalTokenVesting || !allVestsFilter || endBlock === undefined || deploymentBlock === undefined) {
      setAllVests([]);
      return;
    }

    if (endBlock === deploymentBlock) {
      return;
    }

    let startBlock = endBlock - queryPageSize + 1;
    if (startBlock < deploymentBlock) {
      startBlock = deploymentBlock;
    }

    generalTokenVesting.queryFilter(allVestsFilter, startBlock, endBlock)
      .then(newVests => {
        if (newVests.length > 0) {
          addVests(newVests);
        }
      })
      .then(() => {
        setEndBlock(endBlock => {
          if (!endBlock) {
            return undefined;
          }

          let newEndBlock = endBlock - queryPageSize;
          if (newEndBlock < deploymentBlock) {
            newEndBlock = deploymentBlock;
          }

          return newEndBlock;
        });
      })
      .catch(console.error);
  }, [allVestsFilter, endBlock, generalTokenVesting, deploymentBlock, queryPageSize]);

  useEffect(() => {
    if (!generalTokenVesting || !allVestsFilter) {
      setAllVests([]);
      return;
    }

    generalTokenVesting.on(allVestsFilter, addVest);

    return () => {
      generalTokenVesting.off(allVestsFilter, addVest);
    }
  }, [allVestsFilter, generalTokenVesting]);

  return [allVests, loading] as const;
}

export {
  useAllVests,
}
