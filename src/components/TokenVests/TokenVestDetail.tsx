import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { useParams } from 'react-router-dom';
import { Vest } from '../../data/vests';
import { useData } from '../../data';
import useDisplayName from '../../hooks/useDisplayName';
import useDisplayAmount from '../../hooks/useDisplayAmount';
import EtherscanLink from '../ui/EtherscanLink';

function TokenVest() {
  const params = useParams<{ id: string }>();
  const { loading, vests: { all } } = useData();

  const [vest, setVest] = useState<Vest>();
  useEffect(() => {
    if (!params.id) {
      setVest(undefined);
      return;
    }

    const vest = all.find(vest => vest.id === params.id);
    setVest(vest);
  }, [all, params.id]);

  const [tokenAddress, setTokenAddress] = useState<string>();
  const [beneficiaryAddress, setBeneficiaryAddress] = useState<string>();
  const [creatorAddress, setCreatorAddress] = useState<string>();
  const [decimals, setDecimals] = useState<number>();
  const [totalAmount, setTotalAmount] = useState<BigNumber>();
  const [totalVestedAmount, setTotalVestedAmount] = useState<BigNumber>();
  const [claimedAmount, setClaimedAmount] = useState<BigNumber>();
  const [claimableAmount, setClaimableAmount] = useState<BigNumber>();

  useEffect(() => {
    if (!vest) {
      setTokenAddress(undefined);
      setBeneficiaryAddress(undefined);
      setCreatorAddress(undefined);
      setDecimals(undefined);
      setTotalAmount(undefined);
      setTotalVestedAmount(undefined);
      setClaimedAmount(undefined);
      setClaimableAmount(undefined);
      return;
    }

    setTokenAddress(vest.token.address);
    setBeneficiaryAddress(vest.beneficiary);
    setCreatorAddress(vest.creator);
    setDecimals(vest.token.decimals);
    setTotalAmount(vest.totalAmount);
    setTotalVestedAmount(vest.totalVestedAmount);
    setClaimedAmount(vest.claimedAmount);
    setClaimableAmount(vest.claimableAmount);
  }, [vest]);

  const tokenDisplayName = useDisplayName(tokenAddress);
  const beneficiaryDisplayName = useDisplayName(beneficiaryAddress);
  const creatorDisplayName = useDisplayName(creatorAddress);

  const totalAmountDisplay = useDisplayAmount(totalAmount, decimals);
  const totalVestedAmountDisplay = useDisplayAmount(totalVestedAmount, decimals);
  const claimedAmountDisplay = useDisplayAmount(claimedAmount, decimals);
  const claimableAmountDisplay = useDisplayAmount(claimableAmount, decimals);

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
      <div>id: {vest.id}</div>
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

export default TokenVest;
