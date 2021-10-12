import { BigNumber } from 'ethers';
import { Vest } from '../../../data/vests';
import VestProgress from '../../ui/VestProgress';
import EtherscanLink from '../../ui/EtherscanLink';
import useDisplayAmount from '../../../hooks/useDisplayAmount';
import useFormattedDuration from '../../../hooks/useFormattedDuration';

function Card({
  vest,
  children,
  footer,
}: {
  vest: Vest;
  children: React.ReactNode,
  footer: React.ReactNode,
}) {
  const totalAmountDisplay = useDisplayAmount(vest.totalAmount, vest.token.decimals);
  const duration = useFormattedDuration(BigNumber.from(vest.end - vest.start));

  return (
    <div className="border rounded p-4 flex flex-col justify-between bg-purple-100">
      <div className="">
        <div className="text-xl sm:text-2xl mb-4"><span className="font-semibold">{totalAmountDisplay}</span> <EtherscanLink address={vest.token.address}>{vest.token.symbol}</EtherscanLink> for <EtherscanLink address={vest.beneficiary}>{vest.beneficiaryDisplay}</EtherscanLink> over <span className="font-semibold">{duration}</span></div>
        {children}
      </div>
      <div>
        <div className="mb-4">
          <VestProgress vest={vest} />
        </div>
        {footer}
      </div>
    </div>
  );
}

export default Card;
