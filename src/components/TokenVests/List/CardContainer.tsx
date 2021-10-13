import { JSXElementConstructor } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../../data';
import { Vest } from '../../../data/vests';
import Emoji from '../../ui/Emoji';
import Card from '../Card';

function CardContainer({
  vests,
  description,
  cardDetails: CardDetails,
}: {
  vests: Vest[],
  description: string,
  cardDetails: JSXElementConstructor<{ vest: Vest }>,
}) {
  const { loading } = useData();

  if (vests.length === 0) {
    if (loading) {
      return (
        <div>loading {description} vests</div>
      );
    } else {
      return (
        <div>no {description} vests</div>
      );
    }
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
      {vests.map(v => (
        <Card
          key={v.id}
          vest={v}
          footer={
            <Link to={`/vests/${v.id}`} className="flex items-center text-lg sm:text-xl justify-end">
              <div className="mr-1">view details</div>
              <Emoji emoji="👉" />
            </Link>
          }
        >
          <CardDetails vest={v} />
        </Card>
      ))}
    </div>
  );
}

export default CardContainer;
