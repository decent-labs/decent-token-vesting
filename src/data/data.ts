import {
  useGeneralTokenVestingContract,
} from './contracts';

import {
  useCurrentBlock,
  useCurrentTime,
} from './time';

import {
  Vest,
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
  useMyCreatedVests,
  useMyClaimableVests,
} from './vests';

export interface Data {
  loading: boolean,
  vests: {
    all: Vest[],
    myCreated: Vest[],
    myClaimable: Vest[],
  },
};

function useSystemData() {
  const currentBlock = useCurrentBlock();
  const currentTime = useCurrentTime(currentBlock);

  const [generalTokenVestingContract, generalTokenVestingDeploymentBlock] = useGeneralTokenVestingContract();
  
  const [vestIds, vestsLoading] = useVestIds(generalTokenVestingContract, generalTokenVestingDeploymentBlock);
  const vestTokens = useVestTokens(vestIds);
  const vestPeriods = useVestPeriods(generalTokenVestingContract, vestIds);
  const vestTotalAmounts = useVestTotalAmounts(generalTokenVestingContract, vestIds);
  const vestPerSeconds = useVestPerSeconds(vestPeriods, vestTotalAmounts);
  const vestTotalVestedAmounts = useVestTotalVestedAmounts(vestIds, vestTotalAmounts, vestPeriods, vestPerSeconds, currentTime);
  const vestClaimedAmounts = useVestClaimedAmounts(generalTokenVestingContract, vestIds);
  const vestClaimableAmounts = useVestClaimableAmounts(vestTotalVestedAmounts, vestClaimedAmounts);
  const allVests = useAllVests(vestIds, vestTokens, vestPeriods, vestTotalAmounts, vestTotalVestedAmounts, vestClaimedAmounts, vestClaimableAmounts);
  const myCreatedVests = useMyCreatedVests(allVests);
  const myClaimableVests = useMyClaimableVests(allVests);

  const data: Data = {
    loading: vestsLoading,
    vests: {
      all: allVests,
      myCreated: myCreatedVests,
      myClaimable: myClaimableVests,
    },
  };

  useVestsLoading(vestsLoading);

  return data;
}

export { useSystemData };
