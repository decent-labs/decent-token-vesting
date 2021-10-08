import { Link } from 'react-router-dom';
import { Vest } from '../../data/vests';
import useDisplayName from '../../hooks/useDisplayName';
import useDisplayAmount from '../../hooks/useDisplayAmount';
import EtherscanLink from '../ui/EtherscanLink';

function TokenVestStub({
  vest,
}: {
  vest: Vest
}) {
  const tokenDisplayName = useDisplayName(vest.token.instance.address);
  const creatorDisplayName = useDisplayName(vest.creator);
  const beneficiaryDisplayName = useDisplayName(vest.beneficiary);

  const totalAmountDisplay = useDisplayAmount(vest.totalAmount, vest.token.decimals);
  const totalVestedAmountDisplay = useDisplayAmount(vest.totalVestedAmount, vest.token.decimals);
  const releasedAmountDisplay = useDisplayAmount(vest.releasedAmount, vest.token.decimals);
  const releasableAmountDisplay = useDisplayAmount(vest.releasableAmount, vest.token.decimals);

  return (
    <div className="mb-4">
      <div>token: {vest.token.name} ({vest.token.symbol}) <EtherscanLink address={vest.token.instance.address}>{tokenDisplayName}</EtherscanLink></div>
      <div>creator: <EtherscanLink address={vest.creator}>{creatorDisplayName}</EtherscanLink></div>
      <div>beneficiary: <EtherscanLink address={vest.beneficiary}>{beneficiaryDisplayName}</EtherscanLink></div>
      <div>start: {vest.start.toLocaleString()}</div>
      <div>end: {vest.end.toLocaleString()}</div>
      <div>total amount: {totalAmountDisplay}</div>
      <div>total vested amount: {totalVestedAmountDisplay}</div>
      <div>released amount: {releasedAmountDisplay}</div>
      <div>releasable amount: {releasableAmountDisplay}</div>
      <Link to={`${vest.token.instance.address}-${vest.beneficiary}`}>
        View vest details
      </Link>
    </div>
  );
}

export default TokenVestStub;
