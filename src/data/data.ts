import {
  useGeneralTokenVestingContract,
} from './contracts';

import {
  Vest,
  useAllVests,
} from './vests';

export interface Data {
  vests: {
    all: {
      data: Vest[],
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
