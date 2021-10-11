import { useState, useEffect } from 'react';
import { useWeb3 } from '../web3';
import { ERC20Token } from '../data/vests';
import { IERC20Metadata, IERC20Metadata__factory } from '../../contracts/typechain';

const useERC20Token = (tokenAddress: string | undefined) => {
  const { signerOrProvider } = useWeb3();

  const [token, setToken] = useState<ERC20Token>();
  const [tokenInstance, setTokenInstance] = useState<IERC20Metadata>();
  const [validToken, setValidToken] = useState<boolean>();

  useEffect(() => {
    setToken(undefined);
    setValidToken(undefined);

    if (!signerOrProvider || !tokenAddress || tokenAddress.trim() === "") {
      return;
    }

    setTokenInstance(IERC20Metadata__factory.connect(tokenAddress, signerOrProvider));
  }, [signerOrProvider, tokenAddress]);

  useEffect(() => {
    if (!tokenInstance) {
      setToken(undefined);
      setValidToken(undefined);
      return;
    }

    Promise.all([tokenInstance.name(), tokenInstance.symbol(), tokenInstance.decimals()])
      .then(([name, symbol, decimals]) => {
        setToken({
          address: tokenInstance.address,
          instance: tokenInstance,
          name: name,
          symbol: symbol,
          decimals: decimals
        });
        setValidToken(true);
      })
      .catch(() => {
        setToken(undefined);
        setValidToken(false);
      });
  }, [tokenInstance]);

  return [token, validToken] as const;
}

export default useERC20Token;
