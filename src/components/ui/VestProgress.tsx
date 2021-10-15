import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Tooltip from '../ui/Tooltip';
import { AmountProperty } from '../ui/Properties';
import { useData } from '../../data';
import { Vest } from '../../data/vests';
import useDisplayAmount from '../../hooks/useDisplayAmount';
import useElapsedRemainingTime from '../../hooks/useElapsedRemainingTime';

function VestProgress({
  vest,
}: {
  vest: Vest,
}) {
  const { currentTime } = useData();
  const [elapsedTime, remainingTime] = useElapsedRemainingTime(vest.start, vest.end, currentTime);

  const vestedAmountDisplay = useDisplayAmount(vest.vestedAmount, vest.token.decimals, true);
  const claimedAmountDisplay = useDisplayAmount(vest.claimedAmount, vest.token.decimals, true);

  const [claimedAmount, setClaimedAmount] = useState(0);
  useEffect(() => {
    setClaimedAmount(Number(ethers.utils.formatUnits(vest.claimedAmount, vest.token.decimals)));
  }, [vest.claimedAmount, vest.token.decimals]);

  const [totalAmount, setTotalAmountAmount] = useState(0);
  useEffect(() => {
    setTotalAmountAmount(Number(ethers.utils.formatUnits(vest.totalAmount, vest.token.decimals)));
  }, [vest.totalAmount, vest.token.decimals]);

  const [percentageVested, setPercentageVested] = useState(0);
  useEffect(() => {
    setPercentageVested(Math.trunc(elapsedTime / (elapsedTime + remainingTime) * 100 * 100) / 100);
  }, [elapsedTime, remainingTime]);

  const [percentageClaimed, setPercentageClaimed] = useState(0);
  useEffect(() => {
    setPercentageClaimed(Math.trunc(claimedAmount / totalAmount * 100 * 100) / 100);
  }, [claimedAmount, totalAmount]);

  const [percentageClaimedTotal, setPercentageClaimedTotal] = useState(0);
  useEffect(() => {
    setPercentageClaimedTotal(Math.trunc(claimedAmount / totalAmount * 100 * 100) / 100);
  }, [claimedAmount, totalAmount]);

  return (
    <Tooltip tooltip={
      <div className="-my-4">
        <AmountProperty
          title={`claimed amount - ${percentageClaimedTotal}%`}
          value={claimedAmountDisplay}
          symbol={vest.token.symbol}
        />
        <AmountProperty
          title={`vested amount - ${percentageVested}%`}
          value={vestedAmountDisplay}
          symbol={vest.token.symbol}
        />
      </div>
    }>
      <div className="w-full bg-purple-50 rounded-full border h-8 overflow-hidden">
        <div className="pink-stripes h-1/2 w-full" style={{ width: `${percentageClaimed}%` }} />
        <div className="purple-stripes h-1/2 w-full" style={{ width: `${percentageVested}%` }} />
      </div>
    </Tooltip>
  );
}

export default VestProgress;
