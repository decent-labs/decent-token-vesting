import { Vest } from '../../../data/vests';
import useDisplayAmount from '../../../hooks/useDisplayAmount';
import { Property, AmountProperty } from '../../ui/Properties';

function OverAndClaimable({
  vest,
}: {
  vest: Vest,
}) {
  const claimableAmountDisplay = useDisplayAmount(vest.claimableAmount, vest.token.decimals, true);

  return (
    <div className="mb-2">
      <Property title="ended on">
        <div>{new Date(vest.end * 1000).toLocaleString()}</div>
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
