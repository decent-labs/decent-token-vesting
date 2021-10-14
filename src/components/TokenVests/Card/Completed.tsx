import { BigNumber } from 'ethers';
import { useData } from '../../../data';
import { Vest } from '../../../data/vests';
import useFormattedDuration from '../../../hooks/useFormattedDuration';
import { Property } from '../../ui/Properties';

function Completed({
  vest,
  status,
}: {
  vest: Vest,
  status?: React.ReactNode,
}) {
  const { currentTime } = useData();

  const formattedTimeSinceEnd = useFormattedDuration(BigNumber.from(currentTime - vest.end));

  return (
    <div>
      {status}
      <Property title="ended at">
        <div>{new Date(vest.end * 1000).toLocaleString()}</div>
        <div>{formattedTimeSinceEnd} ago</div>
      </Property>
    </div>
  );
}

export default Completed;
