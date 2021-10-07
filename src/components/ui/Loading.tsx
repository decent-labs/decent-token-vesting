import { useState, useEffect } from 'react';

function Loading() {
  const [dots, setDots] = useState("");
  const [maxDots] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(dots => {
        if (dots.length === maxDots) {
          return "";
        }

        return Array(dots.length + 1).fill(".").join("");
      })
    }, 500);

    return () => {
      clearInterval(interval);
    }
  }, [maxDots]);

  return (
    <div className="mb-2">
      loading{dots}
    </div>
  );
}

export default Loading;
