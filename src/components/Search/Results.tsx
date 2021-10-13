import { useState, useEffect } from 'react';
import { useData } from '../../data';
import { Vest } from '../../data/vests';
import Title from '../ui/Title';
import CardContainer from '../TokenVests/List/CardContainer';

function ResultSection({
  title,
  vests,
}: {
  title: string,
  vests: Vest[],
}) {
  return (
    <div className="my-4">
      <Title>{title}</Title>
      <CardContainer
        vests={vests}
        description={title}
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
      <div className="mb-4">search results for {address}</div>
      {tokenResults.length === 0 && beneficiaryResults.length === 0 && creatorResults.length === 0 && (
        <Title>no matches</Title>
      )}
      {tokenResults.length > 0 && (
        <ResultSection
          title={`token results (${tokenResults.length})`}
          vests={tokenResults}
        />
      )}
      {beneficiaryResults.length > 0 && (
        <ResultSection
          title={`beneficiary results (${beneficiaryResults.length})`}
          vests={beneficiaryResults}
        />
      )}
      {creatorResults.length > 0 && (
        <ResultSection
          title={`creator results (${creatorResults.length})`}
          vests={creatorResults}
        />
      )}
    </div>
  );
}

export default Results;
