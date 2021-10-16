import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Tooltip from '../ui/Tooltip';
import { AmountProperty } from '../ui/Properties';
import { useData } from '../../data';
import { Vest } from '../../data/vests';
import useDisplayAmount from '../../hooks/useDisplayAmount';
import useElapsedRemainingTime from '../../hooks/useElapsedRemainingTime';

function TooltipProperty({
  color,
  title,
  value,
  symbol,
}: {
  color: "pink" | "purple",
  title: string,
  value: string | undefined,
  symbol: string,
}) {
  return (
    <div className="flex items-stretch my-4">
      <div className={`mr-2 stripes w-4 rounded ${color}`} />
      <div className="-my-4">
        <AmountProperty
          title={title}
          value={value}
          symbol={symbol}
        />
      </div>
    </div>
  );
}

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

  const [claimedCompleted, setClaimedCompleted] = useState(false);
  useEffect(() => {
    setClaimedCompleted(vest.claimedAmount.eq(vest.totalAmount));
  }, [vest.claimedAmount, vest.totalAmount]);

  const [vestedCompleted, setVestedCompleted] = useState(false);
  useEffect(() => {
    setVestedCompleted(remainingTime === 0);
  }, [remainingTime]);

  return (
    <Tooltip tooltip={
      <div className="-my-4">
        <TooltipProperty
          color="pink"
          title={`claimed amount - ${percentageClaimedTotal}%`}
          value={claimedAmountDisplay}
          symbol={vest.token.symbol}
        />
        <TooltipProperty
          color="purple"
          title={`vested amount - ${percentageVested}%`}
          value={vestedAmountDisplay}
          symbol={vest.token.symbol}
        />
      </div>
    }>
      <div className="bg-purple-50 rounded border box-content h-12 overflow-hidden shadow">
        <div className={`stripes pink h-1/2 w-full ${!claimedCompleted ? "rounded-br animate" : ""}`} style={{ width: `${percentageClaimed}%` }} />
        <div className={`stripes purple h-1/2 w-full ${!vestedCompleted ? "rounded-tr animate" : ""}`} style={{ width: `${percentageVested}%` }} />
      </div>
    </Tooltip>
  );
}

export default VestProgress;
