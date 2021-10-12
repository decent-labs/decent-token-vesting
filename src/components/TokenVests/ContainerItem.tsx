import { Link } from 'react-router-dom';
import { Vest } from '../../data/vests';
import Emoji from '../ui/Emoji';
import VestProgress from '../ui/VestProgress';
import { AmountProperty } from '../ui/Properties';
import useDisplayAmount from '../../hooks/useDisplayAmount';

function ContainerItem({
  vest,
  children,
}: {
  vest: Vest;
  children: React.ReactNode,
}) {
  const totalVestedAmountDisplay = useDisplayAmount(vest.totalVestedAmount, vest.token.decimals, true);
  const claimedAmountDisplay = useDisplayAmount(vest.claimedAmount, vest.token.decimals, true);
  
  return (
    <div className="border rounded p-4 flex flex-col justify-between">
      <div>{children}</div>
      <div>
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
        <Link to={`/vests/${vest.id}`} className="flex items-center text-lg sm:text-xl">
          <div className="mr-1">view details</div>
          <Emoji emoji="👉" />
        </Link>
      </div>
    </div>
  );
}

export default ContainerItem;
