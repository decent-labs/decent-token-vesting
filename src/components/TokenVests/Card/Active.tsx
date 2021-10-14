import { BigNumber } from 'ethers';
import { Vest } from '../../../data/vests';
import { Property, AmountProperty } from '../../ui/Properties';
import useDisplayAmount from '../../../hooks/useDisplayAmount';
import useElapsedRemainingTime from '../../../hooks/useElapsedRemainingTime';
import { useData } from '../../../data';
import useFormattedDuration from '../../../hooks/useFormattedDuration';

function Active({
  vest,
  status,
}: {
  vest: Vest,
  status?: React.ReactNode,
}) {
  const { currentTime } = useData();

  const claimableAmountDisplay = useDisplayAmount(vest.claimableAmount, vest.token.decimals, true);

  const [, remainingTime] = useElapsedRemainingTime(vest.start, vest.end, currentTime);
  const formattedRemainingTime = useFormattedDuration(BigNumber.from(remainingTime));

  return (
    <div>
      {status}
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
