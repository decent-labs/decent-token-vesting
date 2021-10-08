import { useState, useEffect } from 'react';
import { useWeb3 } from '../web3';

const useDisplayName = (account: string | undefined) => {
  const { provider } = useWeb3();

  const [accountSubstring, setAccountSubstring] = useState<string>();
  useEffect(() => {
    if (!account) {
      setAccountSubstring(undefined);
      return;
    }

    setAccountSubstring(`${account.substring(0, 6)}...${account.slice(-4)}`)
  }, [account]);

  const [ensName, setEnsName] = useState<string>();
  useEffect(() => {
    if (!provider || !account) {
      setEnsName(undefined);
      return;
    }

    provider.lookupAddress(account)
      .then(setEnsName)
      .catch(console.error);
  }, [account, provider]);

  const [displayName, setDisplayName] = useState<string>();
  useEffect(() => {
    if (!accountSubstring) {
      setDisplayName(undefined);
      return;
    }

    if (!ensName) {
      setDisplayName(accountSubstring);
      return;
    }

    setDisplayName(ensName);
  }, [accountSubstring, ensName]);

  return displayName;
}

export default useDisplayName;
