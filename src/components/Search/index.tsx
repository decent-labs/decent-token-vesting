import { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { InputAddress } from '../ui/Input';
import Button from '../ui/Button';
import EmojiMessage from '../ui/EmojiMessage';
import useQuery from '../../hooks/useQuery';
import useAddress from '../../hooks/useAddress';
import Results from './Results';

function ValidSearch({
  queryAddress,
  validAddress,
  address,
}: {
  queryAddress: string | undefined,
  validAddress: boolean | undefined,
  address: string | undefined,
}) {
  if (validAddress === true) {
    return (
      <Results address={address} />
    );
  }

  if (validAddress === false) {
    return (
      <EmojiMessage emoji="🙄" size="big">
        <span className="break-all">{queryAddress}</span> is an invalid address
      </EmojiMessage>
    );
  }

  return (
    <></>
  );
}

function Search() {
  const [searchAddressInput, setSearchAddressInput] = useState("");
  const [searchAddress, validSearchAddress] = useAddress(searchAddressInput);
  const [searchAddressStatus, setSearchAddressStatus] = useState("");

  useEffect(() => {
    if (validSearchAddress === false) {
      setSearchAddressStatus("🙅‍♀️ invalid address");
      return;
    }

    if (validSearchAddress === true) {
      setSearchAddressStatus("👍 looks good");
      return;
    }

    setSearchAddressStatus("");
  }, [validSearchAddress]);

  const [searchDisabled, setSearchDisabled] = useState(true);
  useEffect(() => {
    setSearchDisabled(!searchAddress);
  }, [searchAddress]);

  const history = useHistory();
  const location = useRouteMatch();

  const setQuery = (address: string | undefined) => {
    history.push(`${location.path}?q=${address}`)
  }

  const [queryAddress, setQueryAddress] = useState<string>();
  const query = useQuery();

  useEffect(() => {
    const q = query.get("q");

    if (q === null) {
      setQueryAddress(undefined);
      return;
    }

    setQueryAddress(q);
  }, [query]);

  const [address, validAddress] = useAddress(queryAddress);

  return (
    <div>
      <form
        onSubmit={(e) => {
          setQuery(searchAddressInput);
          e.preventDefault();
        }}
      >
        <div className="flex items-end">
          <div className="flex-grow">
            <InputAddress
              title="address search"
              status={searchAddressStatus}
              value={searchAddressInput}
              disabled={false}
              onChange={setSearchAddressInput}
            />
          </div>
          <div className="ml-2 mb-3">
            <Button
              disabled={searchDisabled}
              onClick={() => setQuery(searchAddressInput)}
            >
              search
            </Button>
          </div>
        </div>
      </form>
      <ValidSearch
        queryAddress={queryAddress}
        validAddress={validAddress}
        address={address}
      />
    </div>
  );
}

export default Search;
