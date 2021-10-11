import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { useParams } from 'react-router-dom';
import { Vest } from '../../data/vests';
import { useData } from '../../data';
import useDisplayName from '../../hooks/useDisplayName';
import useDisplayAmount from '../../hooks/useDisplayAmount';
import EtherscanLink from '../ui/EtherscanLink';
import { InputAddress } from '../ui/Input';
import Button from '../ui/Button';
import { useTransaction } from '../../web3/transactions';
import { useWeb3 } from '../../web3';
import useAddress from '../../hooks/useAddress';

function ReleaseTokens({
  vest,
}: {
  vest: Vest
}) {
  const { contracts: { generalTokenVesting } } = useData();
  const [releaseCall, releasePending] = useTransaction();

  const [releaseTokensDisabled, setReleaseTokensDisabled] = useState(true);
  useEffect(() => {
    if (!vest.claimableAmount) {
      setReleaseTokensDisabled(true);
      return;
    }

    setReleaseTokensDisabled(
      releasePending ||
      vest.claimableAmount.eq(0)
    );
  }, [releasePending, vest]);

  const release = () => {
    if (!generalTokenVesting) {
      return;
    }

    releaseCall(
      () => generalTokenVesting.release(vest.token.address, vest.beneficiary),
      "releasing tokens", "releasing tokens failed", "releasing tokens succeeded"
    )
  }

  return (
    <div className="mt-4">
      <Button
        disabled={releaseTokensDisabled}
        onClick={release}
      >
        release tokens
      </Button>
    </div>
  );
}

function ReleaseTokensTo({
  vest,
}: {
  vest: Vest
}) {
  const { contracts: { generalTokenVesting } } = useData();
  const [releaseToCall, releaseToPending] = useTransaction();

  const [beneficiaryAddressInput, setBeneficiaryAddressInput] = useState("");
  const [beneficiaryAddress, validBeneficiaryAddress] = useAddress(beneficiaryAddressInput);
  const [beneficiaryStatus, setBeneficiaryStatus] = useState("");

  useEffect(() => {
    if (validBeneficiaryAddress === false) {
      setBeneficiaryStatus("🙅‍♀️ invalid address");
      return;
    }

    if (validBeneficiaryAddress === true) {
      setBeneficiaryStatus("👍 looks good");
      return;
    }

    setBeneficiaryStatus("");
  }, [validBeneficiaryAddress]);

  const [releaseTokensToDisabled, setReleaseTokensToDisabled] = useState(true);
  useEffect(() => {
    if (!vest.claimableAmount || !beneficiaryAddress) {
      setReleaseTokensToDisabled(true);
      return;
    }

    setReleaseTokensToDisabled(
      releaseToPending ||
      vest.claimableAmount.eq(0)
    );
  }, [beneficiaryAddress, releaseToPending, vest]);

  const releaseTo = () => {
    if (!generalTokenVesting || !beneficiaryAddress) {
      return;
    }

    releaseToCall(
      () => generalTokenVesting.releaseTo(vest.token.address, beneficiaryAddress),
      "releasing tokens to", "releasing tokens to failed", "releasing tokens to succeeded",
      undefined, () => {
        setBeneficiaryAddressInput("");
      }
    )
  }

  return (
    <div className="mt-4">
      <InputAddress
        title="beneficiary address"
        status={beneficiaryStatus}
        value={beneficiaryAddressInput}
        disabled={releaseToPending || vest.claimableAmount.eq(0)}
        onChange={setBeneficiaryAddressInput}
      />
      <Button
        disabled={releaseTokensToDisabled}
        onClick={releaseTo}
      >
        release tokens to
      </Button>
    </div>
  );
}

function Detail() {
  const params = useParams<{ id: string }>();
  const { loading, vests } = useData();
  const { account } = useWeb3();

  const [vest, setVest] = useState<Vest>();
  useEffect(() => {
    if (!params.id) {
      setVest(undefined);
      return;
    }

    const vest = vests.find(vest => vest.id === params.id);
    setVest(vest);
  }, [vests, params.id]);

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
        <div>loading vest</div>
      );
    } else {
      return (
        <div>vest not found</div>
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
      <div>total amount: {totalAmountDisplay} {vest.token.symbol}</div>
      <div>total vested amount: {totalVestedAmountDisplay} {vest.token.symbol}</div>
      <div>claimed amount: {claimedAmountDisplay} {vest.token.symbol}</div>
      <div>claimable amount: {claimableAmountDisplay} {vest.token.symbol}</div>
      {vest.claimableAmount.gt(0) && <ReleaseTokens vest={vest} />}
      {vest.claimableAmount.gt(0) && account && account === beneficiaryAddress && <ReleaseTokensTo vest={vest} />}
    </div>
  );
}

export default Detail;
