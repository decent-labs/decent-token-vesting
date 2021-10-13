import { BigNumber } from 'ethers';
import { useData } from '../../../data';
import { Vest } from '../../../data/vests';
import useFormattedDuration from '../../../hooks/useFormattedDuration';
import { Property } from '../../ui/Properties';
import Status from '../../ui/Status';

function Completed({
  vest,
  searchResult = false,
}: {
  vest: Vest,
  searchResult?: boolean,
}) {
  const { currentTime } = useData();

  const formattedTimeSinceEnd = useFormattedDuration(BigNumber.from(currentTime - vest.end));

  return (
    <div>
      {searchResult && (
        <Status vest={vest} />
      )}
      <Property title="ended at">
        <div>{new Date(vest.end * 1000).toLocaleString()}</div>
        <div>{formattedTimeSinceEnd} ago</div>
      </Property>
    </div>
  );
}

export default Completed;
