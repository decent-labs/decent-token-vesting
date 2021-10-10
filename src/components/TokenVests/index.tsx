import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useWeb3 } from '../../web3';
import { useData } from '../../data';
import ConditionalRoute from '../routing/ConditionalRoute';
import New from './New';
import List from './List';
import Detail from './Detail';

function TokenVests() {
  const { account } = useWeb3();
  const { vests: { all, myClaimable, myCreated } } = useData();
  const match = useRouteMatch();

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
          title="All vests"
          vests={all}
        />
      </Route>
      <Route path={`${match.path}/my`}>
        <List
          title="My vests"
          vests={myClaimable}
        />
      </Route>
      <Route path={`${match.path}/my-created`}>
        <List
          title="My created vests"
          vests={myCreated}
        />
      </Route>
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
