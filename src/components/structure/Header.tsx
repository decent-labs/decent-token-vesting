import { useWeb3 } from '../../web3';
import { connect } from '../../web3/providers';
import Button from '../ui/Button';

function Header() {
  const { account } = useWeb3();

  return (
    <div className="py-4 bg-gray-100 border-b">
      <div className="container flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="text-4xl mr-2 mb-4 sm:mb-0">
          General Token Vesting
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
            <div>Connected with {account.substring(0, 6)}...{account.slice(-4)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
