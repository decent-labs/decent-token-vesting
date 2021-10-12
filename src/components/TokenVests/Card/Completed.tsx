import { BigNumber } from 'ethers';
import { useData } from '../../../data';
import { Vest } from '../../../data/vests';
import useFormattedDuration from '../../../hooks/useFormattedDuration';
import { Property } from '../../ui/Properties';

function Completed({
  vest,
}: {
  vest: Vest,
}) {
  const { currentTime } = useData();

  const formattedTimeSinceEnd = useFormattedDuration(BigNumber.from(currentTime - vest.end));

  return (
    <div>
      <Property title="ended on">
        <div>{new Date(vest.end * 1000).toLocaleString()}</div>
        <div>{formattedTimeSinceEnd} ago</div>
      </Property>
    </div>
  );
}

export default Completed;
