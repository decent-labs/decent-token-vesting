import { useState, useEffect } from 'react';
import { useData } from '../../data';
import { Vest } from '../../data/vests';
import CardContainer from '../TokenVests/List/CardContainer';
import EtherscanLink from '../ui/EtherscanLink';
import EmojiMessage from '../ui/EmojiMessage';
import Loading from '../ui/Loading';

function ResultSection({
  vests,
  emoji,
  children,
}: {
  vests: Vest[],
  emoji: string,
  children: React.ReactNode,
}) {
  return (
    <div>
      <div className="mb-4">
        <EmojiMessage emoji={emoji}>
          <div className="text-xl sm:text-2xl">{children} <span className="text-base sm:text-lg">({vests.length})</span></div>
        </EmojiMessage>
      </div>
      <CardContainer
        vests={vests}
        searchResult={true}
      />
    </div>
  );
}

function Results({
  address,
}: {
  address: string | undefined,
}) {
  const { vests, loading } = useData();

  const [tokenResults, setTokenResults] = useState<Vest[]>([]);
  const [beneficiaryResults, setBeneficiaryResults] = useState<Vest[]>([]);
  const [creatorResults, setCreatorResults] = useState<Vest[]>([]);

  useEffect(() => {
    setTokenResults(vests.filter(v => v.token.address === address));
    setBeneficiaryResults(vests.filter(v => v.beneficiary === address));
    setCreatorResults(vests.filter(v => v.creator === address));
  }, [vests, address]);

  const [anyResults, setAnyResults] = useState(false);

  useEffect(() => {
    setAnyResults(
      tokenResults.length > 0 ||
      beneficiaryResults.length > 0 ||
      creatorResults.length > 0
    )
  }, [beneficiaryResults.length, creatorResults.length, tokenResults.length]);

  return (
    <Loading
      loading={address === undefined || (loading && !anyResults)}
      dataExists={anyResults}
    >
      <div className="mb-4">
        search results for <EtherscanLink address={address}>{address}</EtherscanLink>
      </div>
      {tokenResults.length > 0 && (
        <ResultSection vests={tokenResults} emoji="🪙">
          token results
        </ResultSection>
      )}
      {beneficiaryResults.length > 0 && (
        <ResultSection vests={beneficiaryResults} emoji="💰">
          beneficiary results
        </ResultSection>
      )}
      {creatorResults.length > 0 && (
        <ResultSection vests={creatorResults} emoji="🧑‍🎨">
          creator results
        </ResultSection>
      )}
    </Loading>
  );
}

export default Results;