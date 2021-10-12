import { useData } from '../../../data';
import { Vest } from '../../../data/vests';
import Title from '../../ui/Title';
import ContainerItem from './ContainerItem';
import Stub from './Stub';
import ListMenu from './ListMenu';

function VestsContainer({
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
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
      {vests.map(v => (
        <ContainerItem
          key={v.id}
          vest={v}
        >
          <Stub
            vest={v}
          />
        </ContainerItem>
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
      <VestsContainer
        vests={vests}
        description={title}
      />
    </div>
  );
}

export default FilteredVestsList;
