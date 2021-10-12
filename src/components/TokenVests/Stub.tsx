import { BigNumber } from 'ethers';
import { Vest } from '../../data/vests';
import useDisplayName from '../../hooks/useDisplayName';
import useDisplayAmount from '../../hooks/useDisplayAmount';
import EtherscanLink from '../ui/EtherscanLink';
import { Property, AmountProperty } from '../ui/Properties';
import useElapsedRemainingTime from '../../hooks/useElapsedRemainingTime';
import { useData } from '../../data';
import useFormattedDuration from '../../hooks/useFormattedDuration';
import VestProgress from '../ui/VestProgress';

function Stub({
  vest,
}: {
  vest: Vest,
}) {
  const { currentTime } = useData();

  const beneficiaryDisplayName = useDisplayName(vest.beneficiary);

  const totalAmountDisplay = useDisplayAmount(vest.totalAmount, vest.token.decimals);
  const totalVestedAmountDisplay = useDisplayAmount(vest.totalVestedAmount, vest.token.decimals, true);
  const claimedAmountDisplay = useDisplayAmount(vest.claimedAmount, vest.token.decimals, true);
  const claimableAmountDisplay = useDisplayAmount(vest.claimableAmount, vest.token.decimals, true);

  const [elapsedTime, remainingTime] = useElapsedRemainingTime(vest.start, vest.end, currentTime);
  const formattedElapsedTime = useFormattedDuration(BigNumber.from(elapsedTime));
  const formattedRemainingTime = useFormattedDuration(BigNumber.from(remainingTime));

  return (
    <div className="mb-2">
      <div className="text-xl sm:text-2xl mb-2">{totalAmountDisplay} <EtherscanLink address={vest.token.address}>{vest.token.symbol}</EtherscanLink> for <EtherscanLink address={vest.beneficiary}>{beneficiaryDisplayName}</EtherscanLink></div>
      <Property title="elapsed time">
        <div>{formattedElapsedTime}</div>
      </Property>
      <Property title="remaining time">
        <div>{formattedRemainingTime}</div>
      </Property>
      <AmountProperty
        title="total vested amount"
        value={totalVestedAmountDisplay}
        symbol={vest.token.symbol}
      />
      <AmountProperty
        title="claimed amount"
        value={claimedAmountDisplay}
        symbol={vest.token.symbol}
      />
      <AmountProperty
        title="claimable amount"
        value={claimableAmountDisplay}
        symbol={vest.token.symbol}
      />
      <Property title="progress">
        <VestProgress vest={vest} />
      </Property>
    </div>
  );
}

export default Stub;
