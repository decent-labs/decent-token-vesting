import { Link } from 'react-router-dom';
import { useWeb3 } from '../../web3';
import { connect } from '../../web3/providers';
import Button from '../ui/Button';
import useDisplayName from '../../hooks/useDisplayName';
import EtherscanLink from '../ui/EtherscanLink';

function Header() {
  const { account } = useWeb3();
  const accountDisplayName = useDisplayName(account);

  return (
    <div className="py-4 bg-gray-100 border-b">
      <div className="container flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="text-2xl sm:text-3xl mr-2 mb-4 sm:mb-0">
          <Link to="/" className="hover:no-underline">
            🕰 General Token Vesting
          </Link>
        </div>
        <div className="sm:text-right">
          {!account && (
            <Button
              onClick={connect}
              disabled={false}
            >
              Connect wallet
            </Button>
          )}
          {account && (
            <div>Connected with <EtherscanLink address={account}>{accountDisplayName}</EtherscanLink></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
