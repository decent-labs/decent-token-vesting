import { Link } from 'react-router-dom';
import { useData } from '../../../data';
import { Vest, VestStatusType } from '../../../data/vests';
import EmojiMessage from '../../ui/EmojiMessage';
import Loading from '../../ui/Loading';
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

  return (
    <Loading
      loading={loading}
      dataExists={vests.length > 0}
    >
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        {vests.map(v => (
          <Card
            key={v.id}
            vest={v}
            footer={
              <Link to={`/vesting-schedules/${v.id}`} className="flex items-center justify-end mt-4">
                <EmojiMessage emoji="👉" className="text-lg sm:text-xl" reverse>
                  view details
                </EmojiMessage>
              </Link>
            }
          >
            {v.statusType === VestStatusType.Active && <Active vest={v} searchResult={searchResult} />}
            {v.statusType === VestStatusType.OverAndClaimable && <OverAndClaimable vest={v} searchResult={searchResult} />}
            {v.statusType === VestStatusType.Completed && <Completed vest={v} searchResult={searchResult} />}
          </Card>
        ))}
      </div>
    </Loading>
  );
}

export default CardContainer;
