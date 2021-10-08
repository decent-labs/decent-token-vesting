import { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import numeral from 'numeral';

const useDisplayAmount = (amount: BigNumber | undefined, decimals: number | undefined) => {
  const [displayAmount, setDisplayAmount] = useState<string>();

  useEffect(() => {
    if (!amount || !decimals) {
      setDisplayAmount(undefined);
      return;
    }

    const amountString = ethers.utils.formatUnits(amount, decimals);
    const [before, after] = amountString.split('.');
    const beforeFormatted = numeral(before).format('0,0');

    setDisplayAmount(`${beforeFormatted}.${after}`);
  }, [amount, decimals]);

  return displayAmount;
}

export default useDisplayAmount;
