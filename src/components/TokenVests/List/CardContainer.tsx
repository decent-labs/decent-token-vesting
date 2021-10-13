import { Link } from 'react-router-dom';
import { useData } from '../../../data';
import { Vest, VestStatusType } from '../../../data/vests';
import Emoji from '../../ui/Emoji';
import Title from '../../ui/Title';
import Card from '../Card';
import Active from '../Card/Active';
import Completed from '../Card/Completed';
import OverAndClaimable from '../Card/OverAndClaimable';

function CardContainer({
  vests,
  searchResult = false,
}: {
  vests: Vest[],
  searchResult?: boolean,
}) {
  const { loading } = useData();

  if (vests.length === 0) {
    if (loading) {
      return (
        <div className="flex">
          <div className="mr-1">
            <Emoji emoji="😐" />
          </div>
          <Title>loading those vesting schedules</Title>
        </div>
      );
    } else {
      return (
        <div className="flex">
          <div className="mr-1">
            <Emoji emoji="🤷‍♂️" />
          </div>
          <Title>holup there's nothing here</Title>
        </div>
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
            <div className="mt-4">
              <Link to={`/vests/${v.id}`} className="flex items-center text-lg sm:text-xl justify-end">
                <div className="mr-1">view details</div>
                <Emoji emoji="👉" />
              </Link>
            </div>
          }
        >
          {v.statusType === VestStatusType.Active && <Active vest={v} searchResult={searchResult} />}
          {v.statusType === VestStatusType.OverAndClaimable && <OverAndClaimable vest={v} searchResult={searchResult} />}
          {v.statusType === VestStatusType.Completed && <Completed vest={v} searchResult={searchResult} />}
        </Card>
      ))}
    </div>
  );
}

export default CardContainer;
