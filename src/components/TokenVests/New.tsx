import { useEffect, useState } from 'react';
import { constants } from 'ethers';
import { useHistory } from 'react-router-dom';
import { useWeb3 } from '../../web3';
import { useData } from '../../data';
import Title from '../ui/Title';
import { InputAddress, InputAmount, InputNumber } from '../ui/Input';
import Button from '../ui/Button';
import useAddress from '../../hooks/useAddress';
import useERC20Token from '../../hooks/useERC20Token';
import useBalance from '../../hooks/useBalance';
import useAmount from '../../hooks/useAmount';
import useDisplayAmount from '../../hooks/useDisplayAmount';
import useDuration from '../../hooks/useDuration';
import useAllowance from '../../hooks/useAllowance';
import useUniqueVest from '../../hooks/useUniqueVest';

import { useTransaction } from '../../web3/transactions';

function New() {
  const history = useHistory();
  const { account } = useWeb3();
  const { contracts: { generalTokenVesting } } = useData();
 
  const [tokenAddressInput, setTokenAddressInput] = useState("");
  const [tokenAddress, validTokenAddress] = useAddress(tokenAddressInput);
  const [token, validToken] = useERC20Token(tokenAddress);
  const [tokenStatus, setTokenStatus] = useState("");

  useEffect(() => {
    if (validTokenAddress === false) {
      setTokenStatus("🙅‍♀️ invalid address");
      return;
    }

    if (validToken === false) {
      setTokenStatus("🙅‍♀️ invalid token address");
      return;
    }

    if (validToken === true && token) {
      setTokenStatus(`👍 ${token.name} (${token.symbol})`);
      return;
    }

    setTokenStatus("");
  }, [token, validToken, validTokenAddress]);

  const [tokenAmountInput, setTokenAmountInput] = useState("");
  const tokenAmount = useAmount(tokenAmountInput, token?.decimals);
  const tokenBalance = useBalance(token, account);
  const tokenBalanceDisplay = useDisplayAmount(tokenBalance, token?.decimals);
  const [tokenBalanceStatus, setTokenBalanceStatus] = useState("");

  useEffect(() => {
    setTokenAmountInput("");
  }, [token]);

  useEffect(() => {
    if (!tokenBalance) {
      setTokenBalanceStatus("");
      return;
    }

    if (tokenAmount && tokenAmount.gt(tokenBalance)) {
      setTokenBalanceStatus(`🙅‍♀️ balance: ${tokenBalanceDisplay} too low`);
      return;
    }

    if (tokenBalance.eq(0)) {
      setTokenBalanceStatus(`🙅‍♀️ balance: ${tokenBalanceDisplay}`);
      return;
    }

    setTokenBalanceStatus(`👍 balance: ${tokenBalanceDisplay}`);  
  }, [tokenAmount, tokenBalance, tokenBalanceDisplay]);

  const [beneficiaryAddressInput, setBeneficiaryAddressInput] = useState("");
  const [beneficiaryAddress, validBeneficiaryAddress] = useAddress(beneficiaryAddressInput);
  const uniqueVest = useUniqueVest(token?.address, beneficiaryAddress)
  const [beneficiaryStatus, setBeneficiaryStatus] = useState("");

  useEffect(() => {
    if (validBeneficiaryAddress === false) {
      setBeneficiaryStatus("🙅‍♀️ invalid address");
      return;
    }

    if (uniqueVest === false) {
      setBeneficiaryStatus("🙅‍♀️ vest already exists");
      return;
    }

    if (validBeneficiaryAddress === true) {
      setBeneficiaryStatus("👍 looks good");
      return;
    }

    setBeneficiaryStatus("");
  }, [validBeneficiaryAddress, uniqueVest]);

  const [durationInput, setDurationInput] = useState("");
  const [duration, formattedDuration] = useDuration(durationInput);
  const [durationStatus, setDurationStatus] = useState("");

  useEffect(() => {
    if (!duration) {
      setDurationStatus("");
      return;
    }

    if (duration.eq(0)) {
      setDurationStatus("🙅‍♀️ can't be zero");
      return;
    }

    setDurationStatus(`👍 ${formattedDuration}`);
  }, [duration, formattedDuration]);

  const allowance = useAllowance(token, account, generalTokenVesting?.address);
  const [approveDisabled, setApproveDisabled] = useState(false);
  const [approveTransaction, approvePending] = useTransaction();

  useEffect(() => {
    setApproveDisabled(
      approvePending ||
      !allowance ||
      !tokenAmount ||
      !tokenBalance ||
      tokenAmount.gt(tokenBalance) ||
      allowance.gte(tokenAmount)
    );
  }, [allowance, tokenAmount, approvePending, tokenBalance]);

  const approve = () => {
    if (!token || !generalTokenVesting) {
      return;
    }

    approveTransaction(
      () => token.instance.approve(generalTokenVesting.address, constants.MaxUint256),
      `approving ${token.symbol} for spending`, `approving ${token.symbol} for spending failed`, `approving ${token.symbol} for spending succeeded`
    );
  }

  const [createDisabled, setCreateDisabled] = useState(true);
  const [createTransaction, createPending] = useTransaction();

  useEffect(() => {
    setCreateDisabled(
      createPending ||
      !token ||
      !tokenAmount ||
      tokenAmount.eq(0) ||
      !allowance ||
      allowance.lt(tokenAmount) ||
      !beneficiaryAddress ||
      !uniqueVest ||
      !duration ||
      duration.eq(0)
    );
  }, [allowance, beneficiaryAddress, uniqueVest, createPending, duration, token, tokenAmount]);

  const create = () => {
    if (!generalTokenVesting || !beneficiaryAddress || !tokenAmount || !duration || !token) {
      return;
    }

    createTransaction(
      () => generalTokenVesting.startVest(beneficiaryAddress, tokenAmount, duration, token.address),
      "creating vest", "creating vest failed", "creating vest succeeded",
      undefined, () => {
        const id = `${token.address}-${beneficiaryAddress}`;
        setTokenAddressInput("");
        setTokenAmountInput("");
        setBeneficiaryAddressInput("");
        setDurationInput("");
        history.push(`/vests/${id}`)
      }
    );
  }

  return (
    <div className="pb-4">
      <Title title="create new vest" />
      <div>
        <InputAddress
          title="token address"
          status={tokenStatus}
          value={tokenAddressInput}
          disabled={createPending}
          onChange={setTokenAddressInput}
        />
        <InputAmount
          title="token amount"
          status={tokenBalanceStatus}
          value={tokenAmountInput}
          disabled={createPending}
          onChange={setTokenAmountInput}
          decimals={token?.decimals}
        />
        <InputAddress
          title="beneficiary address"
          status={beneficiaryStatus}
          value={beneficiaryAddressInput}
          disabled={createPending}
          onChange={setBeneficiaryAddressInput}
        />
        <InputNumber
          title="duration (in seconds)"
          status={durationStatus}
          value={durationInput}
          disabled={createPending}
          onChange={setDurationInput}
        />
        <div className="mb-4">
          <Button
            disabled={approveDisabled}
            onClick={approve}
          >
            approve
          </Button>
        </div>
        <div>
          <Button
            disabled={createDisabled}
            onClick={create}
          >
            create vest
          </Button>
        </div>
      </div>
    </div>
  );
}

export default New;
