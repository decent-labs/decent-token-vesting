import { useState, useEffect } from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useWeb3 } from '../../web3';
import { useData } from '../../data';
import { Vest } from '../../data/vests';
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
      <Route path={`${match.path}/all`}>
        <List
          title="all vests"
          vests={vests}
        />
      </Route>
      <ConditionalRoute
        path={`${match.path}/my`}
        authorization={!!account}
      >
        <List
          title="my vests"
          vests={myClaimable}
        />
      </ConditionalRoute>
      <ConditionalRoute
        path={`${match.path}/my-created`}
        authorization={!!account}
      >
        <List
          title="my created vests"
          vests={myCreated}
        />
      </ConditionalRoute>
      <Route path={`${match.path}/:id`}>
        <Detail />
      </Route>
      <Route path={`${match.path}`}>
        <Redirect to={`${match.path}/all`} />
      </Route>
    </Switch>
  );
}

export default TokenVests;
