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
import Card from './Card';
import Emoji from '../ui/Emoji';

function ReleaseTokens({
  vest,
  beneficiaryDisplayName,
}: {
  vest: Vest,
  beneficiaryDisplayName: string,
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
    <div className="mb-4">
      <Button
        disabled={releaseTokensDisabled}
        onClick={release}
      >
        release tokens to {beneficiaryDisplayName}
      </Button>
    </div>
  );
}

function ReleaseTokensTo({
  vest,
}: {
  vest: Vest,
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

  const recipient = useDisplayName(beneficiaryAddress);

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
    <div>
      <InputAddress
        title="alternate beneficiary address"
        status={beneficiaryStatus}
        value={beneficiaryAddressInput}
        disabled={releaseToPending || vest.claimableAmount.eq(0)}
        onChange={setBeneficiaryAddressInput}
      />
      <Button
        disabled={releaseTokensToDisabled}
        onClick={releaseTo}
      >
        release tokens{!releaseTokensToDisabled ? ` to ${recipient}` : ""}
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

  const beneficiaryDisplayName = useDisplayName(vest?.beneficiary);
  const creatorDisplayName = useDisplayName(vest?.creator);
  const claimableAmountDisplay = useDisplayAmount(vest?.claimableAmount, vest?.token.decimals);
  const [, remainingTime] = useElapsedRemainingTime(vest?.start, vest?.end, currentTime);
  const formattedTimeSinceStart = useFormattedDuration(BigNumber.from(currentTime - (vest?.start || 0)));
  const formattedRemainingTime = useFormattedDuration(BigNumber.from(remainingTime));
  const formattedTimeSinceEnd = useFormattedDuration(BigNumber.from(currentTime - (vest?.end || 0)));

  const [status, setStatus] = useState("");
  const [statusEmoji, setStatusEmoji] = useState("");
  useEffect(() => {
    if (!vest) {
      setStatus("");
      setStatusEmoji("");
      return;
    }

    if (currentTime < vest.end) {
      setStatus("active");
      setStatusEmoji("💃");
    } else if (currentTime >= vest.end && vest.claimableAmount.gt(0)) {
      setStatus("over and claimable");
      setStatusEmoji("🤏");
    } else {
      setStatus("completed");
      setStatusEmoji("🤝");
    }
  }, [currentTime, vest]);

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

    setReleaseToable(account === vest?.beneficiary);
  }, [account, releasable, vest?.beneficiary]);

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
    <Card
      vest={vest}
      footer={
        <div>
          {releasable && (
            <ReleaseTokens
              vest={vest}
              beneficiaryDisplayName={beneficiaryDisplayName}
            />
          )}
          {releaseToable && (
            <ReleaseTokensTo vest={vest} />
          )}
        </div>
      }
    >
      <div className="flex items-center text-xl sm:text-2xl">
        <Emoji emoji={statusEmoji} big />
        <div className="ml-2">{status}</div>
      </div>
      <Property title="created by">
        <EtherscanLink address={vest.creator}>{creatorDisplayName}</EtherscanLink>
      </Property>
      <Property title="started on">
        <div>{new Date(vest.start * 1000).toLocaleString()}</div>
        <div>{formattedTimeSinceStart} ago</div>
      </Property>
      <Property title={vest.end > currentTime ? "ending at" : "ended at"}>
        <div>{new Date(vest.end * 1000).toLocaleString()}</div>
        {vest.end > currentTime && <div>in {formattedRemainingTime}</div>}
        {vest.end < currentTime && <div>{formattedTimeSinceEnd} ago</div>}
      </Property>
      {releasable && (
        <AmountProperty
          title="claimable amount"
          value={claimableAmountDisplay}
          symbol={vest.token.symbol}
        />
      )}
    </Card>
  );
}

export default Detail;
