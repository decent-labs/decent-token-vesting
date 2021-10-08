import {
  useGeneralTokenVestingContract,
} from './contracts';

import {
  Vest,
  useAllVests,
  useVestsLoading,
  useMyCreatedVests,
  useMyClaimableVests,
} from './vests';

export interface Data {
  vests: {
    all: Vest[],
    myCreated: Vest[],
    myClaimable: Vest[],
  },
};

function useSystemData() {
  const [generalTokenVestingContract, generalTokenVestingDeploymentBlock] = useGeneralTokenVestingContract();
  const [allVests, allVestsLoading] = useAllVests(generalTokenVestingContract, generalTokenVestingDeploymentBlock);
  const myCreatedVests = useMyCreatedVests(allVests);
  const myClaimableVests = useMyClaimableVests(allVests);

  const data: Data = {
    vests: {
      all: allVests,
      myCreated: myCreatedVests,
      myClaimable: myClaimableVests,
    },
  };

  useVestsLoading(allVestsLoading);

  return data;
}

export { useSystemData };
