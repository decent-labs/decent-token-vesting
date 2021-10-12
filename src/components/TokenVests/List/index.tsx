import { useEffect, useState, JSXElementConstructor } from 'react';
import { Switch, Route, Redirect, useRouteMatch, Link } from 'react-router-dom';
import { useData } from '../../../data';
import { Vest } from '../../../data/vests';
import Title from '../../ui/Title';
import Emoji from '../../ui/Emoji';
import ListMenu from './ListMenu';
import Card from '../Card';
import Active from '../Card/Active';
import Completed from '../Card/Completed';
import OverAndClaimable from '../Card/OverAndClaimable';

function CardContainer({
  vests,
  description,
  cardDetails: CardDetails,
}: {
  vests: Vest[],
  description: string,
  cardDetails: JSXElementConstructor<{ vest: Vest }>,
}) {
  const { loading } = useData();

  if (vests.length === 0) {
    if (loading) {
      return (
        <div>loading {description} vests</div>
      );
    } else {
      return (
        <div>no {description} vests</div>
      );
    }
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
      {vests.map(v => (
        <Card
          key={v.id}
          vest={v}
          footer={
            <Link to={`/vests/${v.id}`} className="flex items-center text-lg sm:text-xl justify-end">
              <div className="mr-1">view details</div>
              <Emoji emoji="👉" />
            </Link>
          }
        >
          <CardDetails vest={v} />
        </Card>
      ))}
    </div>
  );
}

function FilteredList({
  title,
  path,
  vests,
  cardDetails: CardDetails,
}: {
  title: string,
  path: string,
  vests: Vest[],
  cardDetails: JSXElementConstructor<{ vest: Vest }>,
}) {
  return (
    <div>
      <Title title={`${title} vests`} />
      <ListMenu path={path} />
      <CardContainer
        vests={vests}
        description={title}
        cardDetails={CardDetails}
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
    setActive(vests.filter(v => currentTime < v.end));
    setOverAndClaimable(vests.filter(v => currentTime > v.end && v.claimableAmount.gt(0)));
    setCompleted(vests.filter(v => currentTime > v.end && v.claimableAmount.eq(0)));
  }, [currentTime, vests]);

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/active`}>
          <FilteredList
            title={`${title} active`}
            path={match.path}
            vests={active}
            cardDetails={Active}
          />
        </Route>
        <Route path={`${match.path}/over-and-claimable`}>
          <FilteredList
            title={`${title} over and claimable`}
            path={match.path}
            vests={overAndClaimable}
            cardDetails={OverAndClaimable}
          />
        </Route>
        <Route path={`${match.path}/completed`}>
          <FilteredList
            title={`${title} completed`}
            path={match.path}
            vests={completed}
            cardDetails={Completed}
          />
        </Route>
        <Route path={`${match.path}`}>
          <Redirect to={`${match.path}/active`} />
        </Route>
      </Switch>
    </div>
  );
}

export default List;
