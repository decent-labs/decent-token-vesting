import { useData } from '../../data';
import Title from '../ui/Title';
import TokenVest from './TokenVest';

function All() {
  const { vests: { all } } = useData();

  return (
    <div>
      <Title title="All Vests" />
      <div>
        {all.map(v => (
          <TokenVest
            key={`${v.token}-${v.beneficiary}`}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default All;
