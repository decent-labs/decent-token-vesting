import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BigNumber, constants } from 'ethers';
import {
  GeneralTokenVesting,
  IERC20Metadata, IERC20Metadata__factory,
} from '../../contracts/typechain';
import { TypedEventFilter } from '../../contracts/typechain/common';
import { VestStartedEvent } from '../../contracts/typechain/GeneralTokenVesting';
import { useWeb3 } from '../web3';

type VestId = {
  id: string,
  token: string,
  beneficiary: string,
  creator: string,
}

export type ERC20Token = {
  address: string,
  instance: IERC20Metadata,
  name: string,
  symbol: string,
  decimals: number,
}

type Period = {
  start: number,
  end: number,
}

type VestPeriod = {
  vestId: VestId,
  period: Period,
}

type VestTotalAmount = {
  vestId: VestId,
  totalAmount: BigNumber,
}

type VestPerSecond = {
  vestId: VestId,
  perSecond: BigNumber,
}

type VestTotalVestedAmount = {
  vestId: VestId,
  totalVestedAmount: BigNumber,
}

type VestClaimedAmount = {
  vestId: VestId,
  claimedAmount: BigNumber,
}

type VestClaimableAmount = {
  vestId: VestId,
  claimableAmount: BigNumber,
}

export type Vest = {
  id: string,
  beneficiary: string,
  token: ERC20Token,
  creator: string,
  start: number,
  end: number,
  totalAmount: BigNumber,
  totalVestedAmount: BigNumber,
  claimedAmount: BigNumber,
  claimableAmount: BigNumber,
}

const useVestIds = (generalTokenVesting: GeneralTokenVesting | undefined, deploymentBlock: number | undefined) => {
  const { provider } = useWeb3();
  const [vestIds, setVestIds] = useState<VestId[]>([]);
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

  useEffect(() => {
    if (!generalTokenVesting || !allVestsFilter || endBlock === undefined || deploymentBlock === undefined) {
      setVestIds([]);
      return;
    }

    if (endBlock === deploymentBlock) {
      return;
    }

    let startBlock = endBlock - queryPageSize + 1;
    if (startBlock < deploymentBlock) {
      startBlock = deploymentBlock;
    }

    const addVests = (vestEvents: VestStartedEvent[]) => {
      Promise.all(vestEvents.map(vestEvent => Promise.all([vestEvent, vestEvent.getTransaction()])))
        .then(vests => {
          const sortedVests = vests
            .sort(([aEvent], [bEvent]) => bEvent.blockNumber - aEvent.blockNumber)
            .map(([vestEvent, transaction]) => ({
              id: `${vestEvent.args.token}-${vestEvent.args.beneficiary}`,
              token: vestEvent.args.token,
              beneficiary: vestEvent.args.beneficiary,
              creator: transaction.from,
            }));

          setVestIds(allVests => {
            const newAllVests = [...(allVests || []), ...sortedVests];
            return newAllVests;
          });
        })
        .catch(console.error);
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
  }, [allVestsFilter, deploymentBlock, endBlock, generalTokenVesting, queryPageSize]);

  useEffect(() => {
    if (!generalTokenVesting || !allVestsFilter) {
      setVestIds([]);
      return;
    }

    const addVest = (_: string, __: string, ___: BigNumber, vestEvent: VestStartedEvent) => {
      vestEvent.getTransaction()
        .then(transaction => {
          const newVestId = {
            id: `${vestEvent.args.token}-${vestEvent.args.beneficiary}`,
            token: vestEvent.args.token,
            beneficiary: vestEvent.args.beneficiary,
            creator: transaction.from,
          };

          setVestIds(vestIds => {
            const newVestIds = [newVestId, ...(vestIds || [])];
            return newVestIds;
          });
        })
        .catch(console.error);
    }

    generalTokenVesting.on(allVestsFilter, addVest);

    return () => {
      generalTokenVesting.off(allVestsFilter, addVest);
    }
  }, [allVestsFilter, generalTokenVesting]);

  return [vestIds, loading] as const;
}

const useVestTokens = (vestIds: VestId[]) => {
  const { signerOrProvider } = useWeb3();
  const [tokens, setTokens] = useState<ERC20Token[]>([]);

  useEffect(() => {
    const uniqueVestTokenAddresses = [...new Set(vestIds.map(vestId => vestId.token))];

    if (uniqueVestTokenAddresses.length === tokens.length) {
      return;
    }

    if (!signerOrProvider || vestIds.length === 0) {
      setTokens([]);
      return;
    }

    Promise.all(uniqueVestTokenAddresses.map(tokenAddress => {
      const erc20Instance = IERC20Metadata__factory.connect(tokenAddress, signerOrProvider);
      return Promise.all([tokenAddress, erc20Instance, erc20Instance.name(), erc20Instance.symbol(), erc20Instance.decimals()]);
    }))
      .then(tokenData => {
        const tokens: ERC20Token[] = tokenData.map(([address, instance, name, symbol, decimals]) => ({
          address,
          instance,
          name,
          symbol,
          decimals,
        }));

        setTokens(tokens);
      })
      .catch(console.error);
  }, [signerOrProvider, vestIds, tokens]);

  return tokens;
}

const useVestPeriods = (generalTokenVesting: GeneralTokenVesting | undefined, vestIds: VestId[]) => {
  const [vestPeriods, setVestPeriods] = useState<VestPeriod[]>([]);

  useEffect(() => {
    if (vestIds.length === vestPeriods.length) {
      return;
    }

    if (!generalTokenVesting) {
      setVestPeriods([]);
      return;
    }

    Promise.all(vestIds.map(vestId => {
      const vestPeriod = vestPeriods.find(p => p.vestId.id === vestId.id);
      if (vestPeriod) {
        return Promise.all([vestId, BigNumber.from(vestPeriod.period.start), BigNumber.from(vestPeriod.period.end - vestPeriod.period.start)]);
      }
      return Promise.all([vestId, generalTokenVesting.getStart(vestId.token, vestId.beneficiary), generalTokenVesting.getDuration(vestId.token, vestId.beneficiary)]);
    }))
      .then(periodData => {
        const periods: VestPeriod[] = periodData.map(([vestId, start, duration]) => ({
          vestId: vestId,
          period: {
            start: start.toNumber(),
            end: start.add(duration).toNumber(),
          }
        }));

        setVestPeriods(periods);
      })
      .catch(console.error);
  }, [generalTokenVesting, vestIds, vestPeriods]);

  return vestPeriods;
}

const useVestTotalAmounts = (generalTokenVesting: GeneralTokenVesting | undefined, vestIds: VestId[]) => {
  const [vestTotalAmounts, setVestTotalAmounts] = useState<VestTotalAmount[]>([]);

  useEffect(() => {
    if (vestIds.length === vestTotalAmounts.length) {
      return;
    }

    if (!generalTokenVesting) {
      setVestTotalAmounts([]);
      return;
    }

    Promise.all(vestIds.map(vestId => {
      const vestTotalAmount = vestTotalAmounts.find(p => p.vestId.id === vestId.id);
      if (vestTotalAmount) {
        return Promise.all([vestId, vestTotalAmount.totalAmount]);
      }
      return Promise.all([vestId, generalTokenVesting.getTotalTokens(vestId.token, vestId.beneficiary)]);
    }))
      .then(totalAmountsData => {
        const totalAmounts: VestTotalAmount[] = totalAmountsData.map(([vestId, totalAmount]) => ({
          vestId: vestId,
          totalAmount: totalAmount,
        }));

        setVestTotalAmounts(totalAmounts);
      })
      .catch(console.error);
  }, [generalTokenVesting, vestIds, vestTotalAmounts]);

  return vestTotalAmounts;
}

const useVestPerSeconds = (vestPeriods: VestPeriod[], vestTotalAmounts: VestTotalAmount[]) => {
  const [vestsPerSecond, setVestsPerSecond] = useState<VestPerSecond[]>([]);

  useEffect(() => {
    const perSecond = vestPeriods.map(vestPeriod => {
      const duration = vestPeriod.period.end - vestPeriod.period.start;

      let totalAmount = BigNumber.from(0);
      const vestTotalAmount = vestTotalAmounts.find(t => t.vestId.id === vestPeriod.vestId.id);
      if (vestTotalAmount) {
        totalAmount = vestTotalAmount.totalAmount;
      }

      const vestPerSecond: VestPerSecond = {
        vestId: vestPeriod.vestId,
        perSecond: totalAmount.div(duration),
      }

      return vestPerSecond;
    });

    setVestsPerSecond(perSecond);
  }, [vestPeriods, vestTotalAmounts]);

  return vestsPerSecond;
}

const useVestTotalVestedAmounts = (vestIds: VestId[], vestTotalAmounts: VestTotalAmount[], vestPeriods: VestPeriod[], vestPerSeconds: VestPerSecond[], currentTime: BigNumber) => {
  const [vestTotalVestedAmounts, setVestTotalVestedAmounts] = useState<VestTotalVestedAmount[]>([]);

  useEffect(() => {
    const totalVestedAmounts: VestTotalVestedAmount[] = vestIds.map(vestId => {
      const vestPeriod = vestPeriods.find(p => p.vestId.id === vestId.id);
      const vestPerSecond = vestPerSeconds.find(v => v.vestId.id === vestId.id);
      const vestTotalAmount = vestTotalAmounts.find(t => t.vestId.id === vestId.id);

      const totalVestedAmount: VestTotalVestedAmount = {
        vestId: vestId,
        totalVestedAmount: BigNumber.from(0),
      }

      if (!vestPeriod || !vestPerSecond || !vestTotalAmount) {
        return totalVestedAmount;
      }

      if (currentTime.gte(vestPeriod.period.end)) {
        totalVestedAmount.totalVestedAmount = vestTotalAmount.totalAmount;
      } else {
        const elapsed = currentTime.sub(vestPeriod.period.start);
        totalVestedAmount.totalVestedAmount = elapsed.mul(vestPerSecond.perSecond);
      }

      return totalVestedAmount;
    });

    setVestTotalVestedAmounts(totalVestedAmounts)
  }, [currentTime, vestIds, vestTotalAmounts, vestPerSeconds, vestPeriods]);

  return vestTotalVestedAmounts;
}

const useVestClaimedAmounts = (generalTokenVesting: GeneralTokenVesting | undefined, vestIds: VestId[]) => {
  const [vestClaimedAmounts, setVestClaimedAmounts] = useState<VestClaimedAmount[]>([]);

  useEffect(() => {
    if (vestIds.length === vestClaimedAmounts.length) {
      return;
    }

    if (!generalTokenVesting) {
      setVestClaimedAmounts([]);
      return;
    }

    Promise.all(vestIds.map(vestId => {
      const vestClaimedAmount = vestClaimedAmounts.find(p => p.vestId.id === vestId.id);
      if (vestClaimedAmount) {
        return Promise.all([vestId, vestClaimedAmount.claimedAmount]);
      }
      return Promise.all([vestId, generalTokenVesting.getReleasedTokens(vestId.token, vestId.beneficiary)]);
    }))
      .then(claimedAmountsData => {
        const claimedAmounts: VestClaimedAmount[] = claimedAmountsData.map(([vestId, claimedAmount]) => ({
          vestId: vestId,
          claimedAmount: claimedAmount,
        }));

        setVestClaimedAmounts(claimedAmounts);
      })
      .catch(console.error);
  }, [generalTokenVesting, vestIds, vestClaimedAmounts]);

  useEffect(() => {
    if (!generalTokenVesting) {
      return;
    }

    const tokensReleased = (token: string, beneficiary: string, _: string, amount: BigNumber, __: any) => {
      setVestClaimedAmounts(vestClaimedAmounts => {
        const newVestClaimedAmounts = vestClaimedAmounts.map(vestClaimedAmount => {
          const newVestClaimedAmount = Object.assign({}, vestClaimedAmount);
          if (newVestClaimedAmount.vestId.token === token && newVestClaimedAmount.vestId.beneficiary === beneficiary) {
            newVestClaimedAmount.claimedAmount = newVestClaimedAmount.claimedAmount.add(amount);
          }

          return newVestClaimedAmount;
        });

        return newVestClaimedAmounts;
      });
    }

    const filter = generalTokenVesting.filters.TokensReleased();
    generalTokenVesting.on(filter, tokensReleased);

    return () => {
      generalTokenVesting.off(filter, tokensReleased);
    }
  }, [generalTokenVesting]);

  return vestClaimedAmounts;
}

const useVestClaimableAmounts = (vestTotalVestedAmounts: VestTotalVestedAmount[], vestClaimedAmounts: VestClaimedAmount[]) => {
  const [vestClaimableAmounts, setVestClaimableAmounts] = useState<VestClaimableAmount[]>([]);

  useEffect(() => {
    const claimableAmounts: VestClaimableAmount[] = vestTotalVestedAmounts.map(vestTotalVestedAmount => {
      const vestClaimedAmount = vestClaimedAmounts.find(r => r.vestId.id === vestTotalVestedAmount.vestId.id);

      let claimableAmount = BigNumber.from(0);

      if (vestClaimedAmount) {
        claimableAmount = vestTotalVestedAmount.totalVestedAmount.sub(vestClaimedAmount.claimedAmount);
      }

      const vestClaimableAmount: VestClaimableAmount = {
        vestId: vestTotalVestedAmount.vestId,
        claimableAmount: claimableAmount,
      }

      return vestClaimableAmount;
    });

    setVestClaimableAmounts(claimableAmounts);
  }, [vestClaimedAmounts, vestTotalVestedAmounts]);

  return vestClaimableAmounts;
}

const useAllVests = (
  vestIds: VestId[],
  vestTokens: ERC20Token[],
  vestPeriods: VestPeriod[],
  vestTotalAmounts: VestTotalAmount[],
  vestTotalVestedAmounts: VestTotalVestedAmount[],
  vestClaimedAmounts: VestClaimedAmount[],
  vestClaimableAmounts: VestClaimableAmount[],
) => {
  const [allVests, setAllVests] = useState<Vest[]>([]);
  const { provider } = useWeb3();

  useEffect(() => {
    if (!provider) {
      setAllVests([]);
      return;
    }

    setAllVests(vestIds.map(vestId => {
      let token: ERC20Token = {
        address: constants.AddressZero,
        instance: IERC20Metadata__factory.connect(constants.AddressZero, provider),
        name: "...",
        symbol: "...",
        decimals: 0,
      };
      const vestToken = vestTokens.find(t => t.address === vestId.token);
      if (vestToken) {
        token = vestToken;
      }

      let period: Period = {
        start: 0,
        end: 0
      };
      const vestPeriod = vestPeriods.find(p => p.vestId.id === vestId.id);
      if (vestPeriod) {
        period = vestPeriod.period;
      }

      let totalAmount = BigNumber.from(0);
      const vestTotalAmount = vestTotalAmounts.find(t => t.vestId.id === vestId.id);
      if (vestTotalAmount) {
        totalAmount = vestTotalAmount.totalAmount;
      }

      let totalVestedAmount = BigNumber.from(0);
      const vestTotalVestedAmount = vestTotalVestedAmounts.find(a => a.vestId.id === vestId.id);
      if (vestTotalVestedAmount) {
        totalVestedAmount = vestTotalVestedAmount.totalVestedAmount;
      }

      let claimedAmount = BigNumber.from(0);
      const vestClaimedAmount = vestClaimedAmounts.find(r => r.vestId.id === vestId.id);
      if (vestClaimedAmount) {
        claimedAmount = vestClaimedAmount.claimedAmount;
      }

      let claim = BigNumber.from(0);
      const vestClaimableAmount = vestClaimableAmounts.find(r => r.vestId.id === vestId.id);
      if (vestClaimableAmount) {
        claim = vestClaimableAmount.claimableAmount;
      }

      const vest: Vest = {
        id: vestId.id,
        beneficiary: vestId.beneficiary,
        token: token,
        creator: vestId.creator,
        start: period.start,
        end: period.end,
        totalAmount: totalAmount,
        totalVestedAmount: totalVestedAmount,
        claimedAmount: claimedAmount,
        claimableAmount: claim,
      };

      return vest;
    }));
  }, [vestIds, vestTokens, vestPeriods, vestTotalAmounts, vestTotalVestedAmounts, vestClaimedAmounts, vestClaimableAmounts, provider]);

  return allVests;
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
  useVestIds,
  useVestsLoading,
  useVestTokens,
  useVestPeriods,
  useVestTotalAmounts,
  useVestPerSeconds,
  useVestTotalVestedAmounts,
  useVestClaimedAmounts,
  useVestClaimableAmounts,
  useAllVests,
}
