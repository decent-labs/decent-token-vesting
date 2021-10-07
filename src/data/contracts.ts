import { useState, useEffect } from 'react';
import { useWeb3 } from '../web3';
import { useAddresses } from '../web3/chains';
import {
  GeneralTokenVesting, GeneralTokenVesting__factory,
} from '../../contracts/typechain';

const useGeneralTokenVestingContract = () => {
  const { chainId, signerOrProvider } = useWeb3();
  const { generalTokenVesting } = useAddresses(chainId);
  const [contract, setContract] = useState<GeneralTokenVesting>();
  const [deploymentBlock, setDeploymentBlock] = useState<number>();

  useEffect(() => {
    if (!generalTokenVesting || !signerOrProvider) {
      setContract(undefined);
      return;
    }

    setContract(GeneralTokenVesting__factory.connect(generalTokenVesting.address, signerOrProvider));
  }, [generalTokenVesting, signerOrProvider]);

  useEffect(() => {
    if (!generalTokenVesting) {
      setDeploymentBlock(undefined);
      return;
    }

    setDeploymentBlock(generalTokenVesting.deploymentBlock);
  }, [generalTokenVesting]);

  return [contract, deploymentBlock] as const;
}

export {
  useGeneralTokenVestingContract,
}
