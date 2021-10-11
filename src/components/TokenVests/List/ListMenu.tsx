import { Link, useRouteMatch } from 'react-router-dom';
import Emoji from '../../ui/Emoji';

function ListMenuItem({
  emoji,
  title,
  to,
}: {
  emoji: string,
  title: string,
  to: string,
}) {
  const match = useRouteMatch(to);

  return (
    <Link to={to} className={`flex items-center px-2 py-1 ${match ? "active-link" : ""}`}>
      <Emoji emoji={emoji} />
      <div className="ml-2">{title}</div>
    </Link>
  );
}

function ListMenu({
  path,
}: {
  path: string
}) {
  return (
    <div className="flex flex-col sm:flex-row mb-4 -mx-2 -my-1">
      <ListMenuItem
        emoji={`💃`}
        title="active"
        to={`${path}/active`}
      />
      <ListMenuItem
        emoji={`🤏`}
        title="over and claimable"
        to={`${path}/over-and-claimable`}
      />
      <ListMenuItem
        emoji={`🤝`}
        title="completed"
        to={`${path}/completed`}
      />
    </div>
  );
}

export default ListMenu;
