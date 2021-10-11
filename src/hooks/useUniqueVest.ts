import { useState, useEffect } from 'react';
import { useData } from '../data';

const useUniqueVest = (tokenAddress: string | undefined, beneficiaryAddress: string | undefined) => {
  const { vests: { all } } = useData();
  const [unique, setUnique] = useState<boolean>();

  useEffect(() => {
    if (!tokenAddress || !beneficiaryAddress) {
      setUnique(undefined);
      return;
    }

    setUnique(!all.some(a => a.id === `${tokenAddress}-${beneficiaryAddress}`));
  }, [all, beneficiaryAddress, tokenAddress]);

  return unique;
}

export default useUniqueVest;
