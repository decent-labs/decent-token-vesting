import { useData } from '../../data';
import Title from '../ui/Title';
import TokenVestStub from './TokenVestStub';

function All() {
  const { vests: { all } } = useData();

  return (
    <div>
      <Title title="All vests" />
      <div>
        {all.map(v => (
          <TokenVestStub
            key={v.id}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default All;
