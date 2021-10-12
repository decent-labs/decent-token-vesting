import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';

const useFormattedDuration = (duration: BigNumber | undefined) => {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    if (!duration) {
      setFormatted("");
      return;
    }

    const d = duration.div(3600 * 24);
    const h = duration.mod(3600 * 24).div(3600);
    const m = duration.mod(3600).div(60);
    const s = duration.mod(60);

    const dDisplay = d.gt(0) ? d.toString() + (d.eq(1) ? " day, " : " days, ") : "";
    const hDisplay = h.gt(0) ? h.toString() + (h.eq(1) ? " hour, " : " hours, ") : "";
    const mDisplay = m.gt(0) ? m.toString() + (m.eq(1) ? " minute, " : " minutes, ") : "";
    const sDisplay = s.toString() + (s.eq(1) ? " second" : " seconds");

    const display = (dDisplay + hDisplay + mDisplay + sDisplay).trim().replace(/,\s*$/, "");

    setFormatted(display);
  }, [duration]);

  return formatted;
}

export default useFormattedDuration;
