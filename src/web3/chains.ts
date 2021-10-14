import { useState, useEffect } from 'react';

const supportedChains = () => {
  const dev = process.env.NODE_ENV !== 'production' ? [parseInt(process.env.REACT_APP_LOCAL_CHAIN_ID || "0")] : [];
  const supported = [...dev, ...(process.env.REACT_APP_SUPPORTED_CHAIN_IDS || "").split(",").map(i => parseInt(i))];
  return supported;
};

const useAddresses = (chainId: number | undefined) => {
  const [addresses, setAddresses] = useState<{ 
    generalTokenVesting?: {
      address: string,
      deploymentBlock: number,
    }
  }>({});

  useEffect(() => {
    if (!chainId) return;

    if (
      process.env.REACT_APP_LOCAL_CHAIN_ID &&
      chainId === parseInt(process.env.REACT_APP_LOCAL_CHAIN_ID)
    ) {
      if (!process.env.REACT_APP_LOCAL_GENERAL_TOKEN_VESTING_ADDRESS) {
        console.error("No local addresses have been set!");
        setAddresses({});
        return;
      }

      setAddresses({
        generalTokenVesting: JSON.parse(process.env.REACT_APP_LOCAL_GENERAL_TOKEN_VESTING_ADDRESS),
      });
    } else {
      if (!process.env.REACT_APP_GENERAL_TOKEN_VESTING_ADDRESSES) {
        console.error("No addresses have been set!");
        setAddresses({});
        return;
      }

      const networksAddresses: {
        [chaindId: number]: {
          address: string,
          deploymentBlock: number,
        }
      } = JSON.parse(process.env.REACT_APP_GENERAL_TOKEN_VESTING_ADDRESSES);
      
      const generalTokenVestingAddress: {
        address: string,
        deploymentBlock: number,
      } = networksAddresses[chainId];

      if (!generalTokenVestingAddress) {
        console.error(`Address for network ${chainId} is not set!`);
        setAddresses({});
        return;
      }

      setAddresses({
        generalTokenVesting: generalTokenVestingAddress,
      });
    }
  }, [chainId]);

  return addresses;
};

export {
  supportedChains,
  useAddresses
};
