import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Jazzicon } from '@ukstv/jazzicon-react';
import { useImage } from 'react-image'
import { useWeb3 } from '../../web3';
import { connect } from '../../web3/providers';
import Button from '../ui/Button';
import useDisplayName from '../../hooks/useDisplayName';
import useAvatar from '../../hooks/useAvatar';
import EtherscanLink from '../ui/EtherscanLink';
import EmojiMessage from '../ui/EmojiMessage';

function JazziconAvatar({
  address,
}: {
  address: string,
}) {
  return (
    <div className="ml-2 h-10 w-10">
      <Jazzicon address={address} />
    </div>
  );
}

function URLAvatar({
  url,
}: {
  url: string,
}) {
  const { src } = useImage({
    srcList: url
  })

  return (
    <div className="ml-2 h-10 w-10">
      <img className="rounded-full" src={src} alt="avatar" />
    </div>
  );
}

function Avatar({
  address,
  url,
}: {
  address: string,
  url: string | null,
}) {
  if (!url) {
    return (
      <JazziconAvatar address={address} />
    )
  }

  return (
    <Suspense fallback={<JazziconAvatar address={address} />}>
      <URLAvatar url={url} />
    </Suspense>
  )
}

function Header() {
  const { account } = useWeb3();
  const accountDisplayName = useDisplayName(account);
  const avatarURL = useAvatar(account);

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
            <EtherscanLink address={account}>
              <div className="flex items-center">
                <div>{accountDisplayName}</div>
                <Avatar address={account} url={avatarURL} />
              </div>
            </EtherscanLink>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
