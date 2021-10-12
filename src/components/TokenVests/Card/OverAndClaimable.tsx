import { BigNumber } from 'ethers';
import { useData } from '../../../data';
import { Vest } from '../../../data/vests';
import useDisplayAmount from '../../../hooks/useDisplayAmount';
import useFormattedDuration from '../../../hooks/useFormattedDuration';
import { Property, AmountProperty } from '../../ui/Properties';

function OverAndClaimable({
  vest,
}: {
  vest: Vest,
}) {
  const { currentTime } = useData();

  const claimableAmountDisplay = useDisplayAmount(vest.claimableAmount, vest.token.decimals, true);
  const formattedTimeSinceEnd = useFormattedDuration(BigNumber.from(currentTime - vest.end));

  return (
    <div>
      <Property title="ended on">
        <div>{new Date(vest.end * 1000).toLocaleString()}</div>
        <div>{formattedTimeSinceEnd} ago</div>
      </Property>
      <AmountProperty
        title="claimable amount"
        value={claimableAmountDisplay}
        symbol={vest.token.symbol}
      />
    </div>
  );
}

export default OverAndClaimable;
