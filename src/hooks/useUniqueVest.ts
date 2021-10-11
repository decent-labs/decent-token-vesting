import { useState, useEffect } from 'react';
import { useData } from '../data';

const useUniqueVest = (tokenAddress: string | undefined, beneficiaryAddress: string | undefined) => {
  const { vests } = useData();
  const [unique, setUnique] = useState<boolean>();

  useEffect(() => {
    if (!tokenAddress || !beneficiaryAddress) {
      setUnique(undefined);
      return;
    }

    setUnique(!vests.some(a => a.id === `${tokenAddress}-${beneficiaryAddress}`));
  }, [vests, beneficiaryAddress, tokenAddress]);

  return unique;
}

export default useUniqueVest;
