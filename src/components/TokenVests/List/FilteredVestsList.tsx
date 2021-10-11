import { useData } from '../../../data';
import { Vest } from '../../../data/vests';
import Title from '../../ui/Title';
import Stub from '../Stub';
import ListMenu from './ListMenu';

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

function FilteredVestsList({
  title,
  path,
  vests,
}: {
  title: string,
  path: string,
  vests: Vest[],
}) {
  return (
    <div>
      <Title title={`${title} vests`} />
      <ListMenu path={path} />
      <VestsList vests={vests} />
    </div>
  );
}

export default FilteredVestsList;
