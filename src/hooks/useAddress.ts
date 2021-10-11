import { useState, useEffect } from 'react';
import { ethers, constants } from 'ethers';
import { useWeb3 } from '../web3';

const useAddress = (addressInput: string) => {
  const { provider } = useWeb3();

  const [address, setAddress] = useState<string>();
  const [validAddress, setValidAddress] = useState<boolean>();

  useEffect(() => {
    setAddress(undefined);
    setValidAddress(undefined);

    if (!provider || addressInput.trim() === "") {
      return;
    }

    if (addressInput === constants.AddressZero) {
      setAddress(undefined);
      setValidAddress(false);
      return;
    }

    if (ethers.utils.isAddress(addressInput)) {
      setAddress(ethers.utils.getAddress(addressInput));
      setValidAddress(true);
      return;
    }

    setAddress(undefined);
    setValidAddress(false);

    const timeout = setTimeout(() => {
      provider.resolveName(addressInput)
        .then(resolvedAddress => {
          if (!resolvedAddress) {
            setAddress(undefined);
            setValidAddress(false);
            return;
          }
          setAddress(resolvedAddress);
          setValidAddress(true);
        })
        .catch(() => {
          setAddress(undefined);
          setValidAddress(false);
        });
    }, 500);

    return () => {
      clearTimeout(timeout);
    }
  }, [provider, addressInput]);

  return [address, validAddress] as const;
}

export default useAddress;
