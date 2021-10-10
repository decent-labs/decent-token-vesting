import { useData } from '../../data';
import Title from '../ui/Title';
import Stub from './Stub';

function MyCreated() {
  const { vests: { myCreated } } = useData();

  return (
    <div>
      <Title title="My created vests" />
      <div>
        {myCreated.map(v => (
          <Stub
            key={v.id}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default MyCreated;
