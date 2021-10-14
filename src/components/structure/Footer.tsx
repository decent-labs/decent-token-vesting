import { useState, useEffect } from 'react';
import packageJson from '../../../package.json'
import { useData, resetApp } from '../../data';
import { useWeb3 } from '../../web3';
import EtherscanLink from '../ui/EtherscanLink';

function Footer() {
  const { networkName, providerName } = useWeb3();
  const { generalTokenVesting, loading, syncedToBlock } = useData();

  const [emoji, setEmoji] = useState("");
  useEffect(() => {
    const emojis = ["🦺", "❤️", "🖤", "💜", "😘", "😻", "💖", "🎉", "✨", "🔥", "❤️‍🔥", "☠️", "🥰", "👻", "💋", "🎃", "👽", "🤌", "💪", "👌", "👁", "🧠", "🌝", "🌚", "🌈", "🌙", "☃️", "🍑", "🍆", "🎱"];
    setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
  }, []);

  return (
    <div className="bread py-2 border-t text-xs sm:text-sm">
      <div className="container flex flex-col-reverse sm:flex-row sm:justify-between sm:items-end">
        <div className="text-right sm:text-left">
          <div className="font-mono text-xs">v{packageJson.version}{process.env.REACT_APP_GIT_HASH && `+${process.env.REACT_APP_GIT_HASH}`}</div>
          {generalTokenVesting && <div><EtherscanLink address={`${generalTokenVesting.address}#code#L498`}>view on etherscan</EtherscanLink></div>}
          <div>made with <span className="mr-1">{emoji}</span> by <a href="https://decentlabs.io" target="_blank" rel="noreferrer">decent labs</a> in miami 🌴</div>
        </div>
        <div className="text-right">
          <button onClick={() => resetApp()}>reset app</button>
          <div className="flex justify-end">
            <div>synced to {syncedToBlock}</div>
            {loading && (
              <div className="ml-2">(...syncing in background 🙈 )</div>
            )}
          </div>

          <div>{networkName && `${networkName} via `}{providerName}</div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
