import { GeneralTokenVesting } from '../../contracts/typechain';
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
  useVestVestedAmounts,
  useVestClaimedAmounts,
  useVestClaimableAmounts,
  useVestStatuses,
  useAllVests,
} from './vests';

export interface Data {
  contracts: {
    generalTokenVesting: GeneralTokenVesting | undefined,
  },
  loading: boolean,
  currentTime: number,
  vests: Vest[],
};

function useSystemData() {
  const currentBlock = useCurrentBlock();
  const currentTime = useCurrentTime(currentBlock);

  const [generalTokenVestingContract, generalTokenVestingDeploymentBlock] = useGeneralTokenVestingContract();
  
  const [vestIds, vestsLoading] = useVestIds(generalTokenVestingContract, generalTokenVestingDeploymentBlock);
  const vestTokens = useVestTokens(vestIds);
  const vestPeriods = useVestPeriods(generalTokenVestingContract, vestIds);
  const vestTotalAmounts = useVestTotalAmounts(generalTokenVestingContract, vestIds);
  const vestPerSeconds = useVestPerSeconds(vestIds, vestPeriods, vestTotalAmounts);
  const vestVestedAmounts = useVestVestedAmounts(vestIds, vestTotalAmounts, vestPeriods, vestPerSeconds, currentTime);
  const vestClaimedAmounts = useVestClaimedAmounts(generalTokenVestingContract, vestIds);
  const vestClaimableAmounts = useVestClaimableAmounts(vestIds, vestVestedAmounts, vestClaimedAmounts);
  const vestStatuses = useVestStatuses(vestIds, vestPeriods, vestClaimableAmounts, currentTime);
  const allVests = useAllVests(vestIds, vestTokens, vestPeriods, vestTotalAmounts, vestVestedAmounts, vestClaimedAmounts, vestClaimableAmounts, vestStatuses);

  const data: Data = {
    contracts: {
      generalTokenVesting: generalTokenVestingContract,
    },
    currentTime: currentTime,
    loading: vestsLoading,
    vests: allVests,
  };

  useVestsLoading(vestsLoading);

  return data;
}

export { useSystemData };
