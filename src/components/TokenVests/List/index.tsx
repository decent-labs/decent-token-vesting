import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { Vest } from '../../../data/vests';
import FilteredVestsList from './FilteredVestsList';
import { useEffect, useState } from 'react';
import { useData } from '../../../data';

function TokenVests({
  title,
  vests,
}: {
  title: string,
  vests: Vest[],
}) {
  const { currentTime } = useData();
  const match = useRouteMatch();

  const [active, setActive] = useState<Vest[]>([]);
  const [overAndClaimable, setOverAndClaimable] = useState<Vest[]>([]);
  const [completed, setCompleted] = useState<Vest[]>([]);

  useEffect(() => {
    setActive(vests.filter(v => currentTime.lt(v.end)));
    setOverAndClaimable(vests.filter(v => currentTime.gt(v.end) && v.claimableAmount.gt(0)));
    setCompleted(vests.filter(v => currentTime.gt(v.end) && v.claimableAmount.eq(0)));
  }, [currentTime, vests]);

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/active`}>
          <FilteredVestsList
            title={`${title} active`}
            vests={active}
            path={match.path}
          />
        </Route>
        <Route path={`${match.path}/over-and-claimable`}>
          <FilteredVestsList
            title={`${title} over & claimable`}
            vests={overAndClaimable}
            path={match.path}
          />
        </Route>
        <Route path={`${match.path}/completed`}>
          <FilteredVestsList
            title={`${title} completed`}
            vests={completed}
            path={match.path}
          />
        </Route>
        <Route path={`${match.path}`}>
          <Redirect to={`${match.path}/active`} />
        </Route>
      </Switch>
    </div>
  );
}

export default TokenVests;
