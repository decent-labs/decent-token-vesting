import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import { Vest } from '../../data/vests';
import { useData } from '../../data';
import useDisplayName from '../../hooks/useDisplayName';

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

  const [tokenAddress, setTokenAddress] = useState<string>();
  const [creatorAddress, setCreatorAddress] = useState<string>();
  const [beneficiaryAddress, setBeneficiaryAddress] = useState<string>();

  useEffect(() => {
    if (!vest) {
      setTokenAddress(undefined);
      setCreatorAddress(undefined);
      setBeneficiaryAddress(undefined);
      return;
    }

    setTokenAddress(vest.token.instance.address);
    setCreatorAddress(vest.creator);
    setBeneficiaryAddress(vest.beneficiary);
  }, [vest]);

  const tokenDisplayName = useDisplayName(tokenAddress);
  const creatorDisplayName = useDisplayName(creatorAddress);
  const beneficiaryDisplayName = useDisplayName(beneficiaryAddress);

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
      <div>token: {vest.token.name} ({vest.token.symbol}) {tokenDisplayName}</div>
      <div>creator: {creatorDisplayName}</div>
      <div>beneficiary: {beneficiaryDisplayName}</div>
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
