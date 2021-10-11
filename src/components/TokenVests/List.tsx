import { useData } from '../../data';
import { Vest } from '../../data/vests';
import Title from '../ui/Title';
import Stub from './Stub';

function VestsList({
  vests,
}: {
  vests: Vest[],
}) {
  const { loading } = useData();

  if (vests.length === 0) {
    if (loading) {
      return (
        <div>loading token vests</div>
      );
    } else {
      return (
        <div>no token vests</div>
      );
    }
  }

  return (
    <div>
      {vests.map(v => (
        <Stub
          key={v.id}
          vest={v}
        />
      ))}
    </div>
  );
}

function List({
  title,
  vests,
}: {
  title: string,
  vests: Vest[],
}) {
  return (
    <div>
      <Title title={title} />
      <VestsList vests={vests} />
    </div>
  );
}

export default List;
