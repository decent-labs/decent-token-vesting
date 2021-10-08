import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { Vest } from '../../data/vests';
import DisplayName from '../ui/DisplayName';

function TokenVestStub({
  vest,
}: {
  vest: Vest
}) {
  return (
    <div className="mb-4">
      <Link to={`${vest.token.instance.address}-${vest.beneficiary}`}>
        <div>token: {vest.token.name} ({vest.token.symbol}) <DisplayName account={vest.token.instance.address} /></div>
        <div>creator: <DisplayName account={vest.creator} /></div>
        <div>beneficiary: <DisplayName account={vest.beneficiary} /></div>
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
