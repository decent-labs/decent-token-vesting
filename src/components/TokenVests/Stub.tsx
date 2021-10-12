import { BigNumber } from 'ethers';
import { Vest } from '../../data/vests';
import useDisplayAmount from '../../hooks/useDisplayAmount';
import { Property, AmountProperty } from '../ui/Properties';
import useElapsedRemainingTime from '../../hooks/useElapsedRemainingTime';
import { useData } from '../../data';
import useFormattedDuration from '../../hooks/useFormattedDuration';

function Stub({
  vest,
}: {
  vest: Vest,
}) {
  const { currentTime } = useData();

  const claimableAmountDisplay = useDisplayAmount(vest.claimableAmount, vest.token.decimals, true);

  const [elapsedTime, remainingTime] = useElapsedRemainingTime(vest.start, vest.end, currentTime);
  const formattedElapsedTime = useFormattedDuration(BigNumber.from(elapsedTime));
  const formattedRemainingTime = useFormattedDuration(BigNumber.from(remainingTime));

  return (
    <div className="mb-2">
      <Property title="elapsed time">
        <div>{formattedElapsedTime}</div>
      </Property>
      <Property title="remaining time">
        <div>{formattedRemainingTime}</div>
      </Property>
      <AmountProperty
        title="claimable amount"
        value={claimableAmountDisplay}
        symbol={vest.token.symbol}
      />
    </div>
  );
}

export default Stub;
