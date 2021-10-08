import { Switch, Route, Redirect } from "react-router-dom";
import AllTokenVests from '../AllTokenVests';

function Body() {
  return (
    <div className="flex-grow pl-4 pt-4">
      <Switch>
        <Route path="/all-vests">
          <AllTokenVests />
        </Route>
        <Route path="/my-created-vests">
          <AllTokenVests />
        </Route>
        <Route path="/my-claimable-vests">
          <AllTokenVests />
        </Route>
        <Route path="/">
          <Redirect to="/all-vests" />
        </Route>
      </Switch>
    </div>
  )
}

export default Body;
