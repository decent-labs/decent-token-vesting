import { Switch, Route, Redirect } from 'react-router-dom';
import TokenVests from '../TokenVests';

function Body() {
  return (
    <div className="py-4">
      <Switch>
        <Route path="/vests">
          <TokenVests />
        </Route>
        <Route path="/">
          <Redirect to="/vests" />
        </Route>
      </Switch>
    </div>
  )
}

export default Body;
