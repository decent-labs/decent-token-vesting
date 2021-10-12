import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Tooltip from '../ui/Tooltip';
import { useData } from '../../data';
import { Vest } from '../../data/vests';
import useElapsedRemainingTime from '../../hooks/useElapsedRemainingTime';

function Progress({
  vest,
}: {
  vest: Vest,
}) {
  const { currentTime } = useData();
  const [elapsedTime, remainingTime] = useElapsedRemainingTime(vest.start, vest.end, currentTime);

  const [vestedAmount, setVestedAmount] = useState(0);
  useEffect(() => {
    setVestedAmount(Number(ethers.utils.formatUnits(vest.totalVestedAmount, vest.token.decimals)));
  }, [vest.token.decimals, vest.totalVestedAmount]);

  const [claimedAmount, setClaimedAmount] = useState(0);
  useEffect(() => {
    setClaimedAmount(Number(ethers.utils.formatUnits(vest.claimedAmount, vest.token.decimals)));
  }, [vest.claimedAmount, vest.token.decimals]);

  const [percentageVested, setPercentageVested] = useState(0);
  useEffect(() => {
    setPercentageVested(elapsedTime / (elapsedTime + remainingTime) * 100);
  }, [elapsedTime, remainingTime]);

  const [percentageClaimed, setPercentageClaimed] = useState(0);
  useEffect(() => {
    setPercentageClaimed(claimedAmount / vestedAmount * 100);
  }, [claimedAmount, vestedAmount]);

  return (
    <div className="w-full bg-purple-100 rounded-full border h-8 overflow-hidden">
      <div className="purple-stripes h-full" style={{ width: `${percentageVested}%` }}>
        <div className="pink-stripes h-full" style={{ width: `${percentageClaimed}%` }} />
      </div>
    </div>
  );
}

function VestProgress({
  vest,
  tooltip,
}: {
  vest: Vest,
  tooltip?: React.ReactNode,
}) {
  if (!tooltip) {
    return (
      <Progress vest={vest} />
    );
  }

  return (
    <Tooltip tooltip={tooltip}>
      <Progress vest={vest} />
    </Tooltip>
  );
}

export default VestProgress;
