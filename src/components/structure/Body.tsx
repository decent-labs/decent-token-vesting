import { Switch, Route, Redirect } from 'react-router-dom';
import { useData } from '../../data';
import List from '../TokenVests/List';
import Detail from '../TokenVests/Detail';

function Body() {
  const { vests: { all, myClaimable, myCreated } } = useData();

  return (
    <div className="pt-4">
      <Switch>
        <Route path="/vests/all">
          <List
            title="All vests"
            vests={all}
          />
        </Route>
        <Route path="/vests/my">
          <List
            title="My vests"
            vests={myClaimable}
          />
        </Route>
        <Route path="/vests/my-created">
          <List
            title="My created vests"
            vests={myCreated}
          />
        </Route>
        <Route path="/vests/:id">
          <Detail />
        </Route>
        <Route path="/">
          <Redirect to="/vests/all" />
        </Route>
      </Switch>
    </div>
  )
}

export default Body;
