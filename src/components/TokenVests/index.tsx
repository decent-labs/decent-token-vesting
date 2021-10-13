import { useState, useEffect } from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useWeb3 } from '../../web3';
import { useData } from '../../data';
import {
  Vest,
  VEST_ALL_DESCRIPTION,
  VEST_ALL_EMOJI,
  VEST_MY_DESCRIPTION,
  VEST_MY_EMOJI,
  VEST_MY_CREATED_DESCRIPTION,
  VEST_MY_CREATED_EMOJI,
} from '../../data/vests';
import ConditionalRoute from '../routing/ConditionalRoute';
import New from './New';
import List from './List';
import Detail from './Detail';

function TokenVests() {
  const { account } = useWeb3();
  const { vests } = useData();
  const match = useRouteMatch();

  const [myClaimable, setMyClaimable] = useState<Vest[]>([]);
  const [myCreated, setMyCreated] = useState<Vest[]>([]);

  useEffect(() => {
    setMyClaimable(vests.filter(vest => vest.beneficiary === account));
    setMyCreated(vests.filter(vest => vest.creator === account));
  }, [account, vests]);

  return (
    <Switch>
      <ConditionalRoute
        path={`${match.path}/new`}
        authorization={!!account}
      >
        <New />
      </ConditionalRoute>
      <Route path={`${match.path}/${VEST_ALL_DESCRIPTION.replaceAll(" ", "-")}`}>
        <List
          title={VEST_ALL_DESCRIPTION}
          emoji={VEST_ALL_EMOJI}
          vests={vests}
        />
      </Route>
      <ConditionalRoute
        path={`${match.path}/${VEST_MY_DESCRIPTION.replaceAll(" ", "-")}`}
        authorization={!!account}
      >
        <List
          title={VEST_MY_DESCRIPTION}
          emoji={VEST_MY_EMOJI}
          vests={myClaimable}
        />
      </ConditionalRoute>
      <ConditionalRoute
        path={`${match.path}/${VEST_MY_CREATED_DESCRIPTION.replaceAll(" ", "-")}`}
        authorization={!!account}
      >
        <List
          title={VEST_MY_CREATED_DESCRIPTION}
          emoji={VEST_MY_CREATED_EMOJI}
          vests={myCreated}
        />
      </ConditionalRoute>
      <Route path={`${match.path}/:id`}>
        <Detail />
      </Route>
      <Route path={`${match.path}`}>
        <Redirect to={`${match.path}/${VEST_ALL_DESCRIPTION.replaceAll(" ", "-")}`} />
      </Route>
    </Switch>
  );
}

export default TokenVests;
