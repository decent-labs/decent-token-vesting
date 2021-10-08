
import { ethers } from 'ethers';
import { Vest } from '../../data/vests';
import { useData } from '../../data';
import Title from '../ui/Title';

function TokenVest({
  vest,
}: {
  vest: Vest
}) {
  return (
    <div className="mb-4">
      <div>token: {vest.token.name} ({vest.token.symbol}) {vest.token.instance.address}</div>
      <div>creator: {vest.creator}</div>
      <div>beneficiary: {vest.beneficiary}</div>
      <div>start: {vest.start.toLocaleString()}</div>
      <div>end: {vest.end.toLocaleString()}</div>
      <div>total amount: {ethers.utils.formatUnits(vest.totalAmount, vest.token.decimals)}</div>
      <div>total vested amount: {ethers.utils.formatUnits(vest.totalVestedAmount, vest.token.decimals)}</div>
      <div>released amount: {ethers.utils.formatUnits(vest.releasedAmount, vest.token.decimals)}</div>
      <div>releasable amount: {ethers.utils.formatUnits(vest.releasableAmount, vest.token.decimals)}</div>
    </div>
  );
}

function AllTokenVests() {
  const { vests: { all } } = useData();

  return (
    <div>
      <Title title="All Token Vests" />
      <div>
        {all.map(v => (
          <TokenVest
            key={`${v.token}-${v.beneficiary}`}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default AllTokenVests;
