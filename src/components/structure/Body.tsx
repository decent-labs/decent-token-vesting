import { Switch, Route, Redirect } from "react-router-dom";
import All from '../TokenVests/All';
import MyCreated from '../TokenVests/MyCreated';
import MyClaimable from '../TokenVests/MyClaimable';
import TokenVestDetail from '../TokenVests/TokenVestDetail';

function Body() {
  return (
    <div className="flex-grow pl-4 pt-4">
      <Switch>
        <Route path="/all-vests">
          <All />
        </Route>
        <Route path="/my-created-vests">
          <MyCreated />
        </Route>
        <Route path="/my-claimable-vests">
          <MyClaimable />
        </Route>
        <Route path="/:id">
          <TokenVestDetail />
        </Route>
        <Route path="/">
          <Redirect to="/all-vests" />
        </Route>
      </Switch>
    </div>
  )
}

export default Body;
