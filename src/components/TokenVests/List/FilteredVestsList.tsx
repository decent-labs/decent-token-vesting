import { useData } from '../../../data';
import { Vest } from '../../../data/vests';
import Title from '../../ui/Title';
import Stub from '../Stub';
import ListMenu from './ListMenu';

function VestsList({
  vests,
  description,
}: {
  vests: Vest[],
  description: string,
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
      <VestsList
        vests={vests}
        description={title}
      />
    </div>
  );
}

export default FilteredVestsList;
