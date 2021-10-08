import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { Vest } from '../../data/vests';
import useDisplayName from '../../hooks/useDisplayName';

function TokenVestStub({
  vest,
}: {
  vest: Vest
}) {
  const tokenDisplayName = useDisplayName(vest.token.instance.address);
  const creatorDisplayName = useDisplayName(vest.creator);
  const beneficiaryDisplayName = useDisplayName(vest.beneficiary);

  return (
    <div className="mb-4">
      <Link to={`${vest.token.instance.address}-${vest.beneficiary}`}>
        <div>token: {vest.token.name} ({vest.token.symbol}) {tokenDisplayName}</div>
        <div>creator: {creatorDisplayName}</div>
        <div>beneficiary: {beneficiaryDisplayName}</div>
        <div>start: {vest.start.toLocaleString()}</div>
        <div>end: {vest.end.toLocaleString()}</div>
        <div>total amount: {ethers.utils.formatUnits(vest.totalAmount, vest.token.decimals)}</div>
        <div>total vested amount: {ethers.utils.formatUnits(vest.totalVestedAmount, vest.token.decimals)}</div>
        <div>released amount: {ethers.utils.formatUnits(vest.releasedAmount, vest.token.decimals)}</div>
        <div>releasable amount: {ethers.utils.formatUnits(vest.releasableAmount, vest.token.decimals)}</div>
      </Link>
    </div>
  );
}

export default TokenVestStub;
