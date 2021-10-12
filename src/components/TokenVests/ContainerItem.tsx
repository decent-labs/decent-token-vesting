import { Link } from 'react-router-dom';
import { Vest } from '../../data/vests';
import Emoji from '../ui/Emoji';

function ContainerItem({
  vest,
  children,
}: {
  vest: Vest;
  children: React.ReactNode,
}) {
  return (
    <div className="border rounded p-4 flex flex-col justify-between">
      <div>{children}</div>
      <Link to={`/vests/${vest.id}`} className="flex items-center text-lg sm:text-xl">
        <div className="mr-1">view details</div>
        <Emoji emoji="👉" />
      </Link>
    </div>
  );
}

export default ContainerItem;
