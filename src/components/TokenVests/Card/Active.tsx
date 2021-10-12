import { BigNumber } from 'ethers';
import { Vest } from '../../../data/vests';
import useDisplayAmount from '../../../hooks/useDisplayAmount';
import { Property, AmountProperty } from '../../ui/Properties';
import useElapsedRemainingTime from '../../../hooks/useElapsedRemainingTime';
import { useData } from '../../../data';
import useFormattedDuration from '../../../hooks/useFormattedDuration';

function Active({
  vest,
}: {
  vest: Vest,
}) {
  const { currentTime } = useData();

  const claimableAmountDisplay = useDisplayAmount(vest.claimableAmount, vest.token.decimals, true);

  const [, remainingTime] = useElapsedRemainingTime(vest.start, vest.end, currentTime);
  const formattedRemainingTime = useFormattedDuration(BigNumber.from(remainingTime));

  return (
    <div className="mb-2">
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

export default Active;
