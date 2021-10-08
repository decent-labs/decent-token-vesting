import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
  start: Date,
  end: Date,
  totalAmount: BigNumber,
  totalVestedAmount: BigNumber,
  releasedAmount: BigNumber,
  releasableAmount: BigNumber,
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

  const createVest = (newVest: VestStartedEvent, generalTokenVesting: GeneralTokenVesting, signerOrProvider: ethers.providers.Provider | ethers.Signer) => {
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
      generalTokenVesting.getStart(newVest.args.token, newVest.args.beneficiary),
      generalTokenVesting.getDuration(newVest.args.token, newVest.args.beneficiary),
      newVest.args.amount,
      generalTokenVesting.totalVestedAmount(newVest.args.token, newVest.args.beneficiary),
      generalTokenVesting.getReleasedTokens(newVest.args.token, newVest.args.beneficiary),
      generalTokenVesting.getReleasableAmount(newVest.args.token, newVest.args.beneficiary),
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
        vestStartTime,
        vestDurationTime,
        vestTotalAmount,
        vestTotalVestedAmount,
        vestReleasedAmount,
        vestReleasableAmount,
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
          start: new Date(vestStartTime.mul(1000).toNumber()),
          end: new Date(vestStartTime.add(vestDurationTime).mul(1000).toNumber()),
          totalAmount: vestTotalAmount,
          totalVestedAmount: vestTotalVestedAmount,
          releasedAmount: vestReleasedAmount,
          releasableAmount: vestReleasableAmount,
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
      Promise.all(newVests.map(vest => Promise.all([vest, createVest(vest, generalTokenVesting, signerOrProvider)])))
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
        createVest(newVest, generalTokenVesting, signerOrProvider)
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

const useVestsLoading = (allVestsLoading: boolean) => {
  const [loadingToastId, setLoadingToastId] = useState<React.ReactText>();
  useEffect(() => {
    if (loadingToastId && allVestsLoading) {
      return;
    }

    if (loadingToastId && !allVestsLoading) {
      toast.dismiss(loadingToastId);
      return;
    }

    const toastId = toast.info("Loading", {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    });

    setLoadingToastId(toastId);
  }, [allVestsLoading, loadingToastId]);
}

export {
  useAllVests,
  useVestsLoading,
}
