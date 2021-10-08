import { useData } from '../../data';
import Title from '../ui/Title';
import TokenVestStub from './TokenVestStub';

function MyClaimable() {
  const { vests: { myClaimable } } = useData();

  return (
    <div>
      <Title title="My Claimable Vests" />
      <div>
        {myClaimable.map(v => (
          <TokenVestStub
            key={`${v.token}-${v.beneficiary}`}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default MyClaimable;
