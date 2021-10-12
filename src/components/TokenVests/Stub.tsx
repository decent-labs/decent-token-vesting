import { Vest } from '../../data/vests';
import useDisplayName from '../../hooks/useDisplayName';
import useDisplayAmount from '../../hooks/useDisplayAmount';
import EtherscanLink from '../ui/EtherscanLink';

function ValueProperty({
  title,
  value,
  symbol,
}: {
  title: string,
  value: string | undefined,
  symbol: string,
}) {
  return (
    <div className="mb-2">
      <div className="text-base sm:text-lg">{title}</div>
      <div>
        <span className="font-mono text-xs sm:text-sm">{value}</span> <span>{symbol}</span>
      </div>
    </div>
  );
}

function Stub({
  vest,
}: {
  vest: Vest,
}) {
  const beneficiaryDisplayName = useDisplayName(vest.beneficiary);

  const totalAmountDisplay = useDisplayAmount(vest.totalAmount, vest.token.decimals);
  const totalVestedAmountDisplay = useDisplayAmount(vest.totalVestedAmount, vest.token.decimals, true);
  const claimedAmountDisplay = useDisplayAmount(vest.claimedAmount, vest.token.decimals, true);
  const claimableAmountDisplay = useDisplayAmount(vest.claimableAmount, vest.token.decimals, true);

  return (
    <div className="mb-2">
      <div className="text-xl sm:text-2xl mb-2">{totalAmountDisplay} <EtherscanLink address={vest.token.address}>{vest.token.symbol}</EtherscanLink> for <EtherscanLink address={vest.beneficiary}>{beneficiaryDisplayName}</EtherscanLink></div>
      <ValueProperty
        title="total vested amount"
        value={totalVestedAmountDisplay}
        symbol={vest.token.symbol}
      />
      <ValueProperty
        title="claimed amount"
        value={claimedAmountDisplay}
        symbol={vest.token.symbol}
      />
      <ValueProperty
        title="claimable amount"
        value={claimableAmountDisplay}
        symbol={vest.token.symbol}
      />
    </div>
  );
}

export default Stub;
