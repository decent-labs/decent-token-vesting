import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import { Vest } from '../../data/vests';
import { useData } from '../../data';

function TokenVest() {
  const params = useParams<{ id: string }>();
  const { loading, vests: { all } } = useData();

  const [vest, setVest] = useState<Vest>();
  useEffect(() => {
    if (!params.id) {
      setVest(undefined);
      return;
    }

    const [token, beneficiary] = params.id.split("-");
    const vest = all.find(vest => vest.token.instance.address === token && vest.beneficiary === beneficiary);
    setVest(vest);
  }, [all, params.id]);

  if (!vest) {
    if (loading) {
      return (
        <div>Loading token vest</div>
      );
    } else {
      return (
        <div>Token vest not found</div>
      );
    }
  }

  return (
    <div>
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

export default TokenVest;
