import { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useData } from '../../../data';
import {
  Vest,
  VEST_STATUS_ACTIVE_DESCRIPTION,
  VEST_STATUS_OVER_AND_CLAIMABLE_DESCRIPTION,
  VEST_STATUS_COMPLETED_DESCRIPTION,
  VestStatusType,
} from '../../../data/vests';
import Title from '../../ui/Title';
import ListMenu from './ListMenu';
import CardContainer from './CardContainer';

function FilteredList({
  title,
  path,
  vests,
}: {
  title: string,
  path: string,
  vests: Vest[],
}) {
  return (
    <div>
      <Title>{title} vests <span className="text-base sm:text-lg">({vests.length})</span></Title>
      <ListMenu path={path} />
      <CardContainer
        vests={vests}
        description={title}
      />
    </div>
  );
}

function List({
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
    setActive(vests.filter(v => v.statusType === VestStatusType.Active));
    setOverAndClaimable(vests.filter(v => v.statusType === VestStatusType.OverAndClaimable));
    setCompleted(vests.filter(v => v.statusType === VestStatusType.Completed));
  }, [currentTime, vests]);

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/${VEST_STATUS_ACTIVE_DESCRIPTION.replaceAll(" ", "-")}`}>
          <FilteredList
            title={`${title} ${VEST_STATUS_ACTIVE_DESCRIPTION}`}
            path={match.path}
            vests={active}
          />
        </Route>
        <Route path={`${match.path}/${VEST_STATUS_OVER_AND_CLAIMABLE_DESCRIPTION.replaceAll(" ", "-")}`}>
          <FilteredList
            title={`${title} ${VEST_STATUS_OVER_AND_CLAIMABLE_DESCRIPTION}`}
            path={match.path}
            vests={overAndClaimable}
          />
        </Route>
        <Route path={`${match.path}/${VEST_STATUS_COMPLETED_DESCRIPTION.replaceAll(" ", "-")}`}>
          <FilteredList
            title={`${title} ${VEST_STATUS_COMPLETED_DESCRIPTION}`}
            path={match.path}
            vests={completed}
          />
        </Route>
        <Route path={`${match.path}`}>
          <Redirect to={`${match.path}/${VEST_STATUS_ACTIVE_DESCRIPTION.replaceAll(" ", "-")}`} />
        </Route>
      </Switch>
    </div>
  );
}

export default List;
