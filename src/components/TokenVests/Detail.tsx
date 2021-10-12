import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { useParams } from 'react-router-dom';
import { Vest } from '../../data/vests';
import { useData } from '../../data';
import useAddress from '../../hooks/useAddress';
import useDisplayName from '../../hooks/useDisplayName';
import useDisplayAmount from '../../hooks/useDisplayAmount';
import useElapsedRemainingTime from '../../hooks/useElapsedRemainingTime';
import useFormattedDuration from '../../hooks/useFormattedDuration';
import EtherscanLink from '../ui/EtherscanLink';
import { InputAddress } from '../ui/Input';
import Button from '../ui/Button';
import { Property, AmountProperty } from '../ui/Properties';
import { useTransaction } from '../../web3/transactions';
import { useWeb3 } from '../../web3';

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
  const { loading, vests, currentTime } = useData();
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

  const [beneficiaryAddress, setBeneficiaryAddress] = useState<string>();
  const [creatorAddress, setCreatorAddress] = useState<string>();
  const [decimals, setDecimals] = useState<number>();
  const [totalAmount, setTotalAmount] = useState<BigNumber>();
  const [claimableAmount, setClaimableAmount] = useState<BigNumber>();
  const [start, setStart] = useState<number>();
  const [end, setEnd] = useState<number>();

  useEffect(() => {
    if (!vest) {
      setBeneficiaryAddress(undefined);
      setCreatorAddress(undefined);
      setDecimals(undefined);
      setTotalAmount(undefined);
      setClaimableAmount(undefined);
      setStart(undefined);
      setEnd(undefined);
      return;
    }

    setBeneficiaryAddress(vest.beneficiary);
    setCreatorAddress(vest.creator);
    setDecimals(vest.token.decimals);
    setTotalAmount(vest.totalAmount);
    setClaimableAmount(vest.claimableAmount);
    setStart(vest.start);
    setEnd(vest.end);
  }, [vest]);

  const beneficiaryDisplayName = useDisplayName(beneficiaryAddress);
  const creatorDisplayName = useDisplayName(creatorAddress);

  const totalAmountDisplay = useDisplayAmount(totalAmount, decimals);
  const claimableAmountDisplay = useDisplayAmount(claimableAmount, decimals);

  const [elapsedTime, remainingTime] = useElapsedRemainingTime(start, end, currentTime);
  const formattedElapsedTime = useFormattedDuration(BigNumber.from(elapsedTime));
  const formattedRemainingTime = useFormattedDuration(BigNumber.from(remainingTime));

  const [releasable, setReleasable] = useState(false);
  useEffect(() => {
    if (!vest) {
      setReleasable(false);
      return;
    }

    if (vest.end > currentTime) {
      setReleasable(true);
      return;
    }

    setReleasable(vest.claimableAmount.gt(0));
  }, [currentTime, vest]);

  const [releaseToable, setReleaseToable] = useState(false);
  useEffect(() => {
    if (!account || !releasable) {
      setReleaseToable(false);
      return;
    }

    setReleaseToable(account === beneficiaryAddress);
  }, [account, beneficiaryAddress, releasable]);

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
      <div className="text-xl sm:text-2xl mb-2">{totalAmountDisplay} <EtherscanLink address={vest.token.address}>{vest.token.symbol}</EtherscanLink> for <EtherscanLink address={vest.beneficiary}>{beneficiaryDisplayName}</EtherscanLink></div>
      <Property title="created by">
        <EtherscanLink address={vest.creator}>{creatorDisplayName}</EtherscanLink>
      </Property>
      <Property title="started on">
        <div>{new Date(vest.start * 1000).toLocaleString()}</div>
      </Property>
      <Property title="elapsed time">
        <div>{formattedElapsedTime}</div>
      </Property>
      <Property title={vest.end > currentTime ? "ending at" : "ended at"}>
        <div>{new Date(vest.end * 1000).toLocaleString()}</div>
      </Property>
      <Property title="remaining time">
        <div>{formattedRemainingTime}</div>
      </Property>
      <AmountProperty
        title="claimable amount"
        value={claimableAmountDisplay}
        symbol={vest.token.symbol}
      />

      {releasable && <ReleaseTokens vest={vest} />}
      {releaseToable && <ReleaseTokensTo vest={vest} />}
    </div>
  );
}

export default Detail;
