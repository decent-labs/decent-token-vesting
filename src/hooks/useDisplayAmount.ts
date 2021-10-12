import { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import numeral from 'numeral';

const useDisplayAmount = (amount: BigNumber | undefined, decimals: number | undefined, fillZeros: boolean = false) => {
  const [displayAmount, setDisplayAmount] = useState<string>();

  useEffect(() => {
    if (!amount || !decimals) {
      setDisplayAmount(undefined);
      return;
    }

    const amountString = ethers.utils.formatUnits(amount, decimals);
    const [before, after] = amountString.split(".");
    const beforeFormatted = numeral(before).format("0,0");

    let afterFormatted = after;
    if (fillZeros) {
      afterFormatted = after.padEnd(decimals, "0");
    }

    setDisplayAmount(`${beforeFormatted}.${afterFormatted}`);
  }, [amount, decimals, fillZeros]);

  return displayAmount;
}

export default useDisplayAmount;
