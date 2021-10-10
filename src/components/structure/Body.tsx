import { Switch, Route, Redirect } from "react-router-dom";
import All from '../TokenVests/All';
import My from '../TokenVests/My';
import MyCreated from '../TokenVests/MyCreated';
import TokenVestDetail from '../TokenVests/TokenVestDetail';

function Body() {
  return (
    <div className="pt-4">
      <Switch>
        <Route path="/vests/all">
          <All />
        </Route>
        <Route path="/vests/my">
          <My />
        </Route>
        <Route path="/vests/my-created">
          <MyCreated />
        </Route>
        <Route path="/vests/:id">
          <TokenVestDetail />
        </Route>
        <Route path="/">
          <Redirect to="/vests/all" />
        </Route>
      </Switch>
    </div>
  )
}

export default Body;
