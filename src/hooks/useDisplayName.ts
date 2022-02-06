import { useState, useEffect } from 'react';
import { useWeb3 } from '../web3';

export const createAccountSubstring = (account: string) => {
  return `${account.substring(0, 6)}...${account.slice(-4)}`;
}

const useDisplayName = (account: string | undefined) => {
  const { provider } = useWeb3();

  const [accountSubstring, setAccountSubstring] = useState<string>();
  useEffect(() => {
    if (!account) {
      setAccountSubstring(undefined);
      return;
    }

    setAccountSubstring(createAccountSubstring(account))
  }, [account]);

  const [ensName, setEnsName] = useState<string | null>(null);
  useEffect(() => {
    if (!provider || !account) {
      setEnsName(null);
      return;
    }

    provider.lookupAddress(account)
      .then(setEnsName)
      .catch(console.error);
  }, [account, provider]);

  const [displayName, setDisplayName] = useState<string>("");
  useEffect(() => {
    if (!accountSubstring) {
      setDisplayName("");
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
