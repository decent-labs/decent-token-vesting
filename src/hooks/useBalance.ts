import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { ERC20Token } from '../data/vests';

const useBalance = (token: ERC20Token | undefined, address: string | undefined) => {
  const [balance, setBalance] = useState<BigNumber>();

  useEffect(() => {
    if (!address || !token) {
      setBalance(undefined);
      return;
    }

    token.instance.balanceOf(address)
      .then(setBalance)
      .catch(console.error);
    
    const increaseBalance = (_: string, __: string, value: BigNumber, ___: any) => {
      setBalance(balance => {
        if (!balance) {
          return undefined;
        }

        return balance.add(value);
      });
    }

    const decreaseBalance = (_: string, __: string, value: BigNumber, ___: any) => {
      setBalance(balance => {
        if (!balance) {
          return undefined;
        }

        return balance.sub(value);
      });
    }
    
    const balanceIncreaseFilter = token.instance.filters.Transfer(null, address, null);
    const balanceDecreaseFilter = token.instance.filters.Transfer(address, null, null);

    token.instance.on(balanceIncreaseFilter, increaseBalance);
    token.instance.on(balanceDecreaseFilter, decreaseBalance);

    return () => {
      token.instance.off(balanceIncreaseFilter, increaseBalance);
      token.instance.off(balanceDecreaseFilter, decreaseBalance);
    }
  }, [address, token]);

  return balance;
}

export default useBalance;
