import { Link } from 'react-router-dom';
import { useData } from '../../../data';
import { Vest, VestStatusType } from '../../../data/vests';
import EmojiMessage from '../../ui/EmojiMessage';
import Loading from '../../ui/Loading';
import Status from '../../ui/Status';
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
              <div className="flex justify-end mt-4">
                <Link to={`/vesting-schedules/${v.id}`}>
                  <EmojiMessage emoji="👉" reverse size="big">
                    view details
                  </EmojiMessage>
                </Link>
              </div>
            }
          >
            {v.statusType === VestStatusType.Active && (
              <Active
                vest={v}
                status={searchResult && <Status vest={v} size="big" />}
              />
            )}
            {v.statusType === VestStatusType.OverAndClaimable && (
              <OverAndClaimable
                vest={v}
                status={searchResult && <Status vest={v} size="big" />}
              />
            )}
            {v.statusType === VestStatusType.Completed && (
              <Completed
                vest={v}
                status={searchResult && <Status vest={v} size="big" />}
              />
            )}
          </Card>
        ))}
      </div>
    </Loading>
  );
}

export default CardContainer;
