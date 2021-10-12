import { Link } from 'react-router-dom';
import { Vest } from '../../../../data/vests';
import Emoji from '../../../ui/Emoji';
import VestProgress from '../../../ui/VestProgress';
import { AmountProperty } from '../../../ui/Properties';
import EtherscanLink from '../../../ui/EtherscanLink';
import useDisplayAmount from '../../../../hooks/useDisplayAmount';
import useDisplayName from '../../../../hooks/useDisplayName';

function Card({
  vest,
  children,
}: {
  vest: Vest;
  children: React.ReactNode,
}) {
  const beneficiaryDisplayName = useDisplayName(vest.beneficiary);
  const totalAmountDisplay = useDisplayAmount(vest.totalAmount, vest.token.decimals);
  const totalVestedAmountDisplay = useDisplayAmount(vest.totalVestedAmount, vest.token.decimals, true);
  const claimedAmountDisplay = useDisplayAmount(vest.claimedAmount, vest.token.decimals, true);

  return (
    <div className="border rounded p-4 flex flex-col justify-between">
      <div className="mb-2">
        <div className="text-xl sm:text-2xl mb-2">{totalAmountDisplay} <EtherscanLink address={vest.token.address}>{vest.token.symbol}</EtherscanLink> for <EtherscanLink address={vest.beneficiary}>{beneficiaryDisplayName}</EtherscanLink></div>
        <div>{children}</div>
      </div>
      <div>
        <div className="mb-2">
          <VestProgress
            vest={vest}
            tooltip={
              <div>
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
        <Link to={`/vests/${vest.id}`} className="flex items-center text-lg sm:text-xl">
          <div className="mr-1">view details</div>
          <Emoji emoji="👉" />
        </Link>
      </div>
    </div>
  );
}

export default Card;
