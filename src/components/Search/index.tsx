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
  addressLoading,
}: {
  queryAddress: string | undefined,
  validAddress: boolean | undefined,
  address: string | undefined,
  addressLoading: boolean,
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

  if (addressLoading === true) {
    return (
      <EmojiMessage emoji="🤔" size="big">
        looking up <span className="break-all">{queryAddress}</span>
      </EmojiMessage>
    );
  }

  return (
    <></>
  );
}

function Search() {
  const [searchAddressInput, setSearchAddressInput] = useState("");

  const [searchDisabled, setSearchDisabled] = useState(true);
  useEffect(() => {
    setSearchDisabled(searchAddressInput.trim().length === 0);
  }, [searchAddressInput]);

  const history = useHistory();
  const location = useRouteMatch();

  const setQuery = (address: string | undefined) => {
    history.push(`${location.path}?q=${address}`)
  }

  const [queryAddress, setQueryAddress] = useState<string>();
  const query = useQuery();

  const [lastSearch, setLastSearch] = useState("");

  useEffect(() => {
    const q = query.get("q");

    setSearchAddressInput(searchAddressInput => {
      if (q === null) {
        return searchAddressInput;
      }

      if (lastSearch !== q) {
        setLastSearch(q);
        return q;
      }

      return searchAddressInput;
    });
  }, [query, lastSearch]);

  useEffect(() => {
    const q = query.get("q");

    if (q === null) {
      setQueryAddress(undefined);
      return;
    }

    setQueryAddress(q);
  }, [query]);

  const [address, validAddress, addressLoading] = useAddress(queryAddress);

  return (
    <div>
      <div className="mb-4">
        <EmojiMessage emoji="🔎" size="bigger">
          search
        </EmojiMessage>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(searchAddressInput);
        }}
      >
        <div className="flex items-end">
          <div className="flex-grow">
            <InputAddress
              title="address search"
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
        addressLoading={addressLoading}
      />
    </div>
  );
}

export default Search;
