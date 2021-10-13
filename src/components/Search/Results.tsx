import { useState, useEffect } from 'react';
import { useData } from '../../data';
import { Vest } from '../../data/vests';
import Title from '../ui/Title';
import CardContainer from '../TokenVests/List/CardContainer';
import EtherscanLink from '../ui/EtherscanLink';
import Emoji from '../ui/Emoji';

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
    <div className="my-4">
      <div className="flex">
        <div className="mr-1">
          <Emoji emoji={emoji} />
        </div>
        <Title>{children} <span className="text-base sm:text-lg">({vests.length})</span></Title>
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
  address: string,
}) {
  const { vests } = useData();

  const [tokenResults, setTokenResults] = useState<Vest[]>([]);
  const [beneficiaryResults, setBeneficiaryResults] = useState<Vest[]>([]);
  const [creatorResults, setCreatorResults] = useState<Vest[]>([]);

  useEffect(() => {
    setTokenResults(vests.filter(v => v.token.address === address));
    setBeneficiaryResults(vests.filter(v => v.beneficiary === address));
    setCreatorResults(vests.filter(v => v.creator === address));
  }, [vests, address]);

  return (
    <div>
      <div className="mb-4">search results for <EtherscanLink address={address}>{address}</EtherscanLink></div>
      {tokenResults.length === 0 && beneficiaryResults.length === 0 && creatorResults.length === 0 && (
        <div className="flex">
          <div className="mr-1">
            <Emoji emoji="😭" />
          </div>
          <Title>no matches</Title>
        </div>
      )}
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
    </div>
  );
}

export default Results;