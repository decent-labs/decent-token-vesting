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
  const tokenDisplayName = useDisplayName(vest.token.address);
  const beneficiaryDisplayName = useDisplayName(vest.beneficiary);
  const creatorDisplayName = useDisplayName(vest.creator);

  const totalAmountDisplay = useDisplayAmount(vest.totalAmount, vest.token.decimals);
  const totalVestedAmountDisplay = useDisplayAmount(vest.totalVestedAmount, vest.token.decimals);
  const claimedAmountDisplay = useDisplayAmount(vest.claimedAmount, vest.token.decimals);
  const claimableAmountDisplay = useDisplayAmount(vest.claimableAmount, vest.token.decimals);

  return (
    <div className="mb-4">
      <Link to={vest.id}>
        {vest.id}
      </Link>
      <div>token: {vest.token.name} ({vest.token.symbol}) <EtherscanLink address={vest.token.address}>{tokenDisplayName}</EtherscanLink></div>
      <div>beneficiary: <EtherscanLink address={vest.beneficiary}>{beneficiaryDisplayName}</EtherscanLink></div>
      <div>creator: <EtherscanLink address={vest.creator}>{creatorDisplayName}</EtherscanLink></div>
      <div>start: {new Date(vest.start * 1000).toLocaleString()}</div>
      <div>end: {new Date(vest.end * 1000).toLocaleString()}</div>
      <div>total amount: {totalAmountDisplay}</div>
      <div>total vested amount: {totalVestedAmountDisplay}</div>
      <div>claimed amount: {claimedAmountDisplay}</div>
      <div>claimable amount: {claimableAmountDisplay}</div>
    </div>
  );
}

export default TokenVestStub;
