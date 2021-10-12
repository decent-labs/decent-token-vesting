import { useState, useEffect } from 'react';

const useElapsedRemainingTime = (start: number | undefined, end: number | undefined, current: number) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!start || !end) {
      setElapsedTime(0);
      return;
    }

    if (current > end) {
      setElapsedTime(end - start);
      return;
    }

    setElapsedTime(current - start);
  }, [start, end, current]);

  useEffect(() => {
    if (!end) {
      setRemainingTime(0);
      return;
    }

    if (current > end) {
      setRemainingTime(0);
      return;
    }

    setRemainingTime(end - current);
  }, [end, current]);

  return [elapsedTime, remainingTime] as const;
}

export default useElapsedRemainingTime;
