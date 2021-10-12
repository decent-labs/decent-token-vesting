import { BigNumber } from 'ethers';
import { Vest } from '../../../data/vests';
import VestProgress from '../../ui/VestProgress';
import { AmountProperty } from '../../ui/Properties';
import EtherscanLink from '../../ui/EtherscanLink';
import useDisplayAmount from '../../../hooks/useDisplayAmount';
import useDisplayName from '../../../hooks/useDisplayName';
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
  const beneficiaryDisplayName = useDisplayName(vest.beneficiary);
  const totalAmountDisplay = useDisplayAmount(vest.totalAmount, vest.token.decimals);
  const totalVestedAmountDisplay = useDisplayAmount(vest.totalVestedAmount, vest.token.decimals, true);
  const claimedAmountDisplay = useDisplayAmount(vest.claimedAmount, vest.token.decimals, true);
  const duration = useFormattedDuration(BigNumber.from(vest.end - vest.start));

  return (
    <div className="border rounded p-4 flex flex-col justify-between">
      <div className="">
        <div className="text-xl sm:text-2xl mb-4"><span className="font-semibold">{totalAmountDisplay}</span> <EtherscanLink address={vest.token.address}>{vest.token.symbol}</EtherscanLink> for <EtherscanLink address={vest.beneficiary}>{beneficiaryDisplayName}</EtherscanLink> over <span className="font-semibold">{duration}</span></div>
        {children}
      </div>
      <div>
        <div className="mb-4">
          <VestProgress
            vest={vest}
            tooltip={
              <div className="-my-4">
                <AmountProperty
                  title="vested amount"
                  value={totalVestedAmountDisplay}
                  symbol={vest.token.symbol}
                />
                <AmountProperty
                  title="claimed amount"
                  value={claimedAmountDisplay}
                  symbol={vest.token.symbol}
                />
              </div>
            }
          />
        </div>
        {footer}
      </div>
    </div>
  );
}

export default Card;
