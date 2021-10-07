import { VestStartedEvent } from '../../../contracts/typechain/GeneralTokenVesting';
import { useData } from '../../data';
import Loading from '../ui/Loading';

function Vest({
  vest,
}: {
  vest: VestStartedEvent
}) {
  return (
    <div className="mb-4">
      <div>{vest.args.token}</div>
      <div>{vest.args.beneficiary}</div>
      <div>{vest.args.amount.toString()}</div>
    </div>
  );
}

function AllTokenVests() {
  const { vests: { all: { data, loading } } } = useData();

  return (
    <div>
      <div className="text-3xl mb-4">
        All Token Vests
      </div>
      <div>
        {loading && <Loading />}
        {data.map((v, i) => (
          <Vest
            key={i}
            vest={v}
          />
        ))}
      </div>
    </div>
  );
}

export default AllTokenVests;
