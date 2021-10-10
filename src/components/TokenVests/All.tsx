import { useData } from '../../data';
import Title from '../ui/Title';
import Stub from './Stub';

function All() {
  const { vests: { all } } = useData();

  return (
    <div>
      <Title title="All vests" />
      <div>
        {all.map(v => (
          <Stub
            key={v.id}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default All;
