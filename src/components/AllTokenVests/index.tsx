
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
      <div>creator: {vest.creator}</div>
      <div>beneficiary: {vest.beneficiary}</div>
      <div>token: {vest.token.name} ({vest.token.symbol})</div>
      <div>total amount: {ethers.utils.formatUnits(vest.totalAmount, vest.token.decimals)}</div>
    </div>
  );
}

function AllTokenVests() {
  const { vests: { all: { data, loading } } } = useData();

  return (
    <div>
      <Title title="All Token Vests" isLoading={loading} />
      <div>
        {data.map((v, i) => (
          <TokenVest
            key={i}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default AllTokenVests;
