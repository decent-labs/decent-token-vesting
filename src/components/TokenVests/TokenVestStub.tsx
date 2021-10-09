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
  const beneficiaryDisplayName = useDisplayName(vest.beneficiary);
  const creatorDisplayName = useDisplayName(vest.creator);

  const totalAmountDisplay = useDisplayAmount(vest.totalAmount, vest.token.decimals);
  const totalVestedAmountDisplay = useDisplayAmount(vest.totalVestedAmount, vest.token.decimals);
  const releasedAmountDisplay = useDisplayAmount(vest.releasedAmount, vest.token.decimals);
  const releasableAmountDisplay = useDisplayAmount(vest.releasableAmount, vest.token.decimals);

  return (
    <div className="mb-4">
      <div>id: {vest.id}</div>
      <div>token: {vest.token.name} ({vest.token.symbol}) <EtherscanLink address={vest.token.instance.address}>{tokenDisplayName}</EtherscanLink></div>
      <div>beneficiary: <EtherscanLink address={vest.beneficiary}>{beneficiaryDisplayName}</EtherscanLink></div>
      <div>creator: <EtherscanLink address={vest.creator}>{creatorDisplayName}</EtherscanLink></div>
      <div>start: {new Date(vest.start * 1000).toLocaleString()}</div>
      <div>end: {new Date(vest.end * 1000).toLocaleString()}</div>
      <div>total amount: {totalAmountDisplay}</div>
      <div>total vested amount: {totalVestedAmountDisplay}</div>
      <div>released amount: {releasedAmountDisplay}</div>
      <div>releasable amount: {releasableAmountDisplay}</div>
      <Link to={vest.id}>
        View vest details
      </Link>
    </div>
  );
}

export default TokenVestStub;
