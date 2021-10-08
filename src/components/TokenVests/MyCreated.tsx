import { useData } from '../../data';
import Title from '../ui/Title';
import TokenVestStub from './TokenVestStub';

function MyCreated() {
  const { vests: { myCreated } } = useData();

  return (
    <div>
      <Title title="My created vests" />
      <div>
        {myCreated.map(v => (
          <TokenVestStub
            key={`${v.token}-${v.beneficiary}`}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default MyCreated;
