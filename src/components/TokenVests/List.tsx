import { Vest } from '../../data/vests';
import Title from '../ui/Title';
import Stub from './Stub';

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
      <div>
        {vests.map(v => (
          <Stub
            key={v.id}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default List;
