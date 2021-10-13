import { BigNumber } from 'ethers';
import { Vest } from '../../../data/vests';
import VestProgress from '../../ui/VestProgress';
import EtherscanLink from '../../ui/EtherscanLink';
import Container from '../../ui/Container';
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
    <Container>
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="text-xl sm:text-2xl mb-4">
            <span className="font-semibold">{totalAmountDisplay} </span>
            <EtherscanLink address={vest.token.address}>{vest.token.symbol} </EtherscanLink>
            <span>for </span>
            <EtherscanLink address={vest.beneficiary}>{vest.beneficiaryDisplay} </EtherscanLink>
            <span>over </span>
            <span className="font-semibold">{duration}</span>
          </div>
          {children}
        </div>
        <div>
          <VestProgress vest={vest} />
          {footer}
        </div>
      </div>
    </Container>
  );
}

export default Card;
