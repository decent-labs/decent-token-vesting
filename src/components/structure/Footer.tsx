import { useWeb3 } from '../../web3'
import packageJson from '../../../package.json'

function Footer() {
  const web3 = useWeb3();

  return (
    <div className="py-2 mt-4 border-t bg-gray-100 text-sm">
      <div className="container flex flex-col sm:flex-row sm:justify-between sm:items-center items-end">
        <div className="font-mono text-xs">v{packageJson.version}{process.env.REACT_APP_GIT_HASH && `+${process.env.REACT_APP_GIT_HASH}`}</div>
        <div>{web3.networkName && `${web3.networkName} via `}{web3.providerName}</div>
      </div>
    </div>
  );
}

export default Footer;
