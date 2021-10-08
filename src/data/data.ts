import {
  useGeneralTokenVestingContract,
} from './contracts';

import {
  Vest,
  useAllVests,
  useVestsLoading,
} from './vests';

export interface Data {
  vests: {
    all: Vest[],
  },
};

function useSystemData() {
  const [generalTokenVestingContract, generalTokenVestingDeploymentBlock] = useGeneralTokenVestingContract();
  const [allVests, allVestsLoading] = useAllVests(generalTokenVestingContract, generalTokenVestingDeploymentBlock);

  const data: Data = {
    vests: {
      all: allVests,
    },
  };

  useVestsLoading(allVestsLoading);

  return data;
}

export { useSystemData };
