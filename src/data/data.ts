import { GeneralTokenVesting } from '../../contracts/typechain';
import {
  useGeneralTokenVestingContract,
} from './contracts';

import {
  useCurrentBlock,
  useCurrentTime,
} from './time';

import {
  useVestIds,
} from './vestIds';

import {
  Vest,
  useVestTokens,
  useVestPeriods,
  useVestTotalAmounts,
  useVestPerSeconds,
  useVestVestedAmounts,
  useVestClaimedAmounts,
  useVestClaimableAmounts,
  useVestStatuses,
  useVestDisplayNames,
  useAllVests,
} from './vests';

export interface Data {
  generalTokenVesting: GeneralTokenVesting | undefined,
  loading: boolean,
  syncedToBlock: number,
  currentTime: number,
  vests: Vest[],
};

function useSystemData() {
  const currentBlock = useCurrentBlock();
  const currentTime = useCurrentTime(currentBlock);

  const [generalTokenVestingContract, generalTokenVestingDeploymentBlock] = useGeneralTokenVestingContract();

  const [vestIds, syncedToBlock, vestIdsLoading] = useVestIds(generalTokenVestingContract, generalTokenVestingDeploymentBlock, currentBlock);
  const vestTokens = useVestTokens(vestIds);
  const vestPeriods = useVestPeriods(generalTokenVestingContract, vestIds);
  const vestTotalAmounts = useVestTotalAmounts(generalTokenVestingContract, vestIds);
  const vestPerSeconds = useVestPerSeconds(vestIds, vestPeriods, vestTotalAmounts);
  const vestVestedAmounts = useVestVestedAmounts(vestIds, vestTotalAmounts, vestPeriods, vestPerSeconds, currentTime);
  const vestClaimedAmounts = useVestClaimedAmounts(generalTokenVestingContract, vestIds);
  const vestClaimableAmounts = useVestClaimableAmounts(vestIds, vestVestedAmounts, vestClaimedAmounts);
  const vestStatuses = useVestStatuses(vestIds, vestPeriods, vestClaimableAmounts, currentTime);
  const vestDisplayNames = useVestDisplayNames(vestIds);
  const [allVests, vestsLoading] = useAllVests(vestIdsLoading, vestIds, vestTokens, vestPeriods, vestTotalAmounts, vestPerSeconds, vestVestedAmounts, vestClaimedAmounts, vestClaimableAmounts, vestStatuses, vestDisplayNames);

  const data: Data = {
    generalTokenVesting: generalTokenVestingContract,
    loading: vestsLoading,
    syncedToBlock: syncedToBlock,
    currentTime: currentTime,
    vests: allVests,
  };

  return data;
}

export { useSystemData };
