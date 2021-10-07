import {
  VestStartedEvent,
} from '../../contracts/typechain/GeneralTokenVesting';

import {
  useGeneralTokenVestingContract,
} from './contracts';

import {
  useAllVests,
} from './vests';

export interface Data {
  vests: {
    all: {
      data: VestStartedEvent[],
      loading: boolean,
    },
  },
};

function useSystemData() {
  const [generalTokenVestingContract, generalTokenVestingDeploymentBlock] = useGeneralTokenVestingContract();
  const [allVests, allVestsLoading] = useAllVests(generalTokenVestingContract, generalTokenVestingDeploymentBlock);

  const data: Data = {
    vests: {
      all: {
        data: allVests,
        loading: allVestsLoading,
      },
    },
  };

  return data;
}

export { useSystemData };
