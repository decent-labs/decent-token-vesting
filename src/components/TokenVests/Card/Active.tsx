import { BigNumber } from 'ethers';
import { Vest } from '../../../data/vests';
import { Property, AmountProperty } from '../../ui/Properties';
import useDisplayAmount from '../../../hooks/useDisplayAmount';
import useElapsedRemainingTime from '../../../hooks/useElapsedRemainingTime';
import { useData } from '../../../data';
import useFormattedDuration from '../../../hooks/useFormattedDuration';
import Status from '../../ui/Status';

function Active({
  vest,
  searchResult = false,
}: {
  vest: Vest,
  searchResult?: boolean,
}) {
  const { currentTime } = useData();

  const claimableAmountDisplay = useDisplayAmount(vest.claimableAmount, vest.token.decimals, true);

  const [, remainingTime] = useElapsedRemainingTime(vest.start, vest.end, currentTime);
  const formattedRemainingTime = useFormattedDuration(BigNumber.from(remainingTime));

  return (
    <div>
      {searchResult && (
        <Status vest={vest} />
      )}
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
