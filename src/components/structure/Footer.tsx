import packageJson from '../../../package.json'
import { useData } from '../../data';
import { useWeb3 } from '../../web3';
import EtherscanLink from '../ui/EtherscanLink';

function Footer() {
  const { networkName, providerName } = useWeb3();
  const { contracts: { generalTokenVesting } } = useData();

  return (
    <div className="bread py-2 border-t text-xs sm:text-sm">
      <div className="container flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center items-end">
        <div className="flex items-baseline">
          <div className="font-mono text-xs">v{packageJson.version}{process.env.REACT_APP_GIT_HASH && `+${process.env.REACT_APP_GIT_HASH}`}</div>
          <div className="px-2">|</div>
          <div><EtherscanLink address={`${generalTokenVesting?.address}#code`}>view on etherscan</EtherscanLink></div>
        </div>
        <div>{networkName && `${networkName} via `}{providerName}</div>
      </div>
    </div>
  );
}

export default Footer;
