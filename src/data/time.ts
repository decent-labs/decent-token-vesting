import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { useWeb3 } from '../web3';

const useCurrentBlock = () => {
  const [currentBlock, setCurrentBlock] = useState<number>();
  const { provider } = useWeb3();

  useEffect(() => {
    if (!provider) {
      setCurrentBlock(undefined);
      return;
    }

    const setBlockNumber = (blockNumber: number) => {
      setCurrentBlock(blockNumber);
    }

    provider.getBlockNumber()
      .then(setBlockNumber)
      .catch(console.error);

    provider.on('block', setBlockNumber);

    return () => {
      provider.off('block', setBlockNumber);
    }
  }, [provider]);

  return currentBlock;
}

const useCurrentTime = (blockNumber: number | undefined) => {
  const { provider } = useWeb3();
  const [currentTime, setCurrentTime] = useState(BigNumber.from(Math.floor(Date.now() / 1000)));

  useEffect(() => {
    if (!provider || !blockNumber) {
      setCurrentTime(BigNumber.from(Math.floor(Date.now() / 1000)));
      return;
    }

    provider.getBlock(blockNumber)
      .then(block => {
        setCurrentTime(BigNumber.from(block.timestamp));
      })
      .catch(console.error);

    const interval = setInterval(() => {
      setCurrentTime(currentTime => currentTime.add(1));
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [provider, blockNumber])

  return currentTime;
}

export {
  useCurrentBlock,
  useCurrentTime,
}
