import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { ERC20Token } from '../data/vests';

const useAllowance = (token: ERC20Token | undefined, owner: string | undefined, spender: string | undefined) => {
  const [allowance, setAllowance] = useState<BigNumber>();

  useEffect(() => {
    if (!token || !owner || !spender) {
      setAllowance(undefined);
      return;
    }

    token.instance.allowance(owner, spender)
      .then(setAllowance)
      .catch(console.error);
    
    const updateAllowance = (_: string, __: string, value: BigNumber, ___: any) => {
      setAllowance(value);
    }
    
    const approvalFilter = token.instance.filters.Approval(owner, spender, null);
    token.instance.on(approvalFilter, updateAllowance);

    return () => {
      token.instance.off(approvalFilter, updateAllowance);
    }
  }, [owner, spender, token]);

  return allowance;
}

export default useAllowance;
