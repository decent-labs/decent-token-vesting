import { useData } from '../../data';
import Title from '../ui/Title';
import Stub from './Stub';

function My() {
  const { vests: { myClaimable } } = useData();

  return (
    <div>
      <Title title="My vests" />
      <div>
        {myClaimable.map(v => (
          <Stub
            key={v.id}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default My;
