import { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import {
  GeneralTokenVesting,
  IERC20Metadata, IERC20Metadata__factory,
} from '../../contracts/typechain';
import { TypedEventFilter } from '../../contracts/typechain/common';
import { VestStartedEvent } from '../../contracts/typechain/GeneralTokenVesting';
import { useWeb3 } from '../web3';

type ERC20Token = {
  instance: IERC20Metadata,
  name: string,
  symbol: string,
  decimals: number,
}

export type Vest = {
  token: ERC20Token,
  creator: string,
  beneficiary: string,
  totalAmount: BigNumber,
}

const useAllVests = (generalTokenVesting: GeneralTokenVesting | undefined, deploymentBlock: number | undefined) => {
  const { provider, signerOrProvider } = useWeb3();
  const [allVests, setAllVests] = useState<Vest[]>([]);
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

  const createVest = (newVest: VestStartedEvent, signerOrProvider: ethers.providers.Provider | ethers.Signer) => {
    const erc20Instance = IERC20Metadata__factory.connect(newVest.args.token, signerOrProvider);

    return Promise.all([
      Promise.all([
        erc20Instance,
        erc20Instance.name(),
        erc20Instance.symbol(),
        erc20Instance.decimals(),
      ]),
      newVest.getTransaction().then(transaction => transaction.from),
      newVest.args.beneficiary,
      newVest.args.amount,
    ])
      .then(([
        [
          erc20Instance,
          erc20Name,
          erc20Symbol,
          erc20Decimals,
        ],
        vestCreator,
        vestBeneficiary,
        vestTotalAmount,
      ]) => {
        const vest: Vest = {
          token: {
            instance: erc20Instance,
            name: erc20Name,
            symbol: erc20Symbol,
            decimals: erc20Decimals,
          },
          creator: vestCreator,
          beneficiary: vestBeneficiary,
          totalAmount: vestTotalAmount,
        };
        return vest;
      });
  }

  useEffect(() => {
    if (!generalTokenVesting || !allVestsFilter || endBlock === undefined || deploymentBlock === undefined || !signerOrProvider) {
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

    const addVests = (newVests: VestStartedEvent[], signerOrProvider: ethers.providers.Provider | ethers.Signer) => {
      Promise.all(newVests.map(vest => Promise.all([vest, createVest(vest, signerOrProvider)])))
        .then(vests => {
          const newSortedVests = vests
            .sort(([aEvent], [bEvent]) => bEvent.blockNumber - aEvent.blockNumber)
            .map(([, vest]) => vest);

          setAllVests(allVests => {
            const newAllVests = [...(allVests || []), ...newSortedVests];
            return newAllVests;
          });
        })
        .catch(console.error);
    }

    generalTokenVesting.queryFilter(allVestsFilter, startBlock, endBlock)
      .then(newVests => {
        if (newVests.length > 0) {
          addVests(newVests, signerOrProvider);
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
  }, [allVestsFilter, endBlock, generalTokenVesting, deploymentBlock, queryPageSize, signerOrProvider]);

  useEffect(() => {
    if (!generalTokenVesting || !allVestsFilter || !signerOrProvider) {
      setAllVests([]);
      return;
    }

    const addVest = (signerOrProvider: ethers.providers.Provider | ethers.Signer) => {
      return (newVest: VestStartedEvent, _: any) => {
        createVest(newVest, signerOrProvider)
          .then(vest => {
            if (!vest) {
              return;
            }

            setAllVests(allVests => {
              const newAllVests = [vest, ...(allVests || [])];
              return newAllVests;
            });
          })
          .catch(console.error);
      }
    }

    const listener = addVest(signerOrProvider);

    generalTokenVesting.on(allVestsFilter, listener);

    return () => {
      generalTokenVesting.off(allVestsFilter, listener);
    }
  }, [allVestsFilter, generalTokenVesting, signerOrProvider]);

  return [allVests, loading] as const;
}

export {
  useAllVests,
}
