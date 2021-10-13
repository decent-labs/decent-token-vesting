import { Switch, Route, Redirect } from 'react-router-dom';
import TokenVests from '../TokenVests';
import Search from '../Search';

function Body() {
  return (
    <div className="py-4">
      <Switch>
        <Route path="/vesting-schedules">
          <TokenVests />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/">
          <Redirect to="/vesting-schedules" />
        </Route>
      </Switch>
    </div>
  )
}

export default Body;
