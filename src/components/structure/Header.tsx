import { Link } from 'react-router-dom';
import { useWeb3 } from '../../web3';
import { connect } from '../../web3/providers';
import Button from '../ui/Button';
import useDisplayName from '../../hooks/useDisplayName';
import EtherscanLink from '../ui/EtherscanLink';
import EmojiMessage from '../ui/EmojiMessage';

function Header() {
  const { account } = useWeb3();
  const accountDisplayName = useDisplayName(account);

  return (
    <div className="bread py-4 border-b shadow">
      <div className="container flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mr-2 mb-4 sm:mb-0">
          <Link to="/">
            <EmojiMessage emoji="🕰" size="biggest">
              decent token vesting
            </EmojiMessage>
          </Link>
        </div>
        <div className="sm:text-right">
          {!account && (
            <Button
              onClick={connect}
              disabled={false}
            >
              connect wallet
            </Button>
          )}
          {account && (
            <div>connected with <EtherscanLink address={account}>{accountDisplayName}</EtherscanLink></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
