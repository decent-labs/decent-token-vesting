import { Link, useRouteMatch } from 'react-router-dom';
import {
  VEST_STATUS_ACTIVE_EMOJI,
  VEST_STATUS_ACTIVE_DESCRIPTION,
  VEST_STATUS_OVER_AND_CLAIMABLE_EMOJI,
  VEST_STATUS_OVER_AND_CLAIMABLE_DESCRIPTION,
  VEST_STATUS_COMPLETED_EMOJI,
  VEST_STATUS_COMPLETED_DESCRIPTION,
} from '../../../data/vests';
import EmojiMessage from '../../ui/EmojiMessage';

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
    <div className="flex py-1">
      <Link to={to} className={`${match ? "active-link" : ""}`}>
        <EmojiMessage emoji={emoji}>
          {title}
        </EmojiMessage>
      </Link>
    </div>
  );
}

function ListMenu({
  path,
}: {
  path: string
}) {
  return (
    <div className="mb-4 -my-1">
      <ListMenuItem
        emoji={VEST_STATUS_ACTIVE_EMOJI}
        title={VEST_STATUS_ACTIVE_DESCRIPTION}
        to={`${path}/${VEST_STATUS_ACTIVE_DESCRIPTION.replaceAll(" ", "-")}`}
      />
      <ListMenuItem
        emoji={VEST_STATUS_OVER_AND_CLAIMABLE_EMOJI}
        title={VEST_STATUS_OVER_AND_CLAIMABLE_DESCRIPTION}
        to={`${path}/${VEST_STATUS_OVER_AND_CLAIMABLE_DESCRIPTION.replaceAll(" ", "-")}`}
      />
      <ListMenuItem
        emoji={VEST_STATUS_COMPLETED_EMOJI}
        title={VEST_STATUS_COMPLETED_DESCRIPTION}
        to={`${path}/${VEST_STATUS_COMPLETED_DESCRIPTION.replaceAll(" ", "-")}`}
      />
    </div>
  );
}

export default ListMenu;
