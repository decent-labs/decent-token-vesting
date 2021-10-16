import { Link, useRouteMatch } from 'react-router-dom';
import {
  VEST_ALL_DESCRIPTION,
  VEST_ALL_EMOJI,
  VEST_MY_DESCRIPTION,
  VEST_MY_EMOJI,
  VEST_MY_CREATED_DESCRIPTION,
  VEST_MY_CREATED_EMOJI,
} from '../../data/vests';
import { useWeb3 } from '../../web3';

function MenuItem({
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
    <Link to={to} className={`flex flex-col items-center py-2 sm:pr-4 text-right sm:block ${match ? "active-link" : ""}`}>
      <div className="text-lg sm:text-xl">{emoji}</div>
      <div className="hidden sm:block">{title}</div>
    </Link>
  );
}

function Separator() {
  return (
    <div className="border-b mt-2 mb-2 shadow" />
  );
}

function Menu() {
  const { account } = useWeb3();

  return (
    <div className="-my-2">
      <MenuItem
        emoji="🔎"
        title="search"
        to="/search"
      />
      <Separator />
      {account && (
        <div>
          <MenuItem
            emoji="⏲"
            title="create new vesting schedule"
            to="/vesting-schedules/new"
          />
          <Separator />
        </div>
      )}
      <MenuItem
        emoji={VEST_ALL_EMOJI}
        title={`${VEST_ALL_DESCRIPTION} vesting schedules`}
        to={`/vesting-schedules/${VEST_ALL_DESCRIPTION.replace(" ", "-")}`}
      />
      {account && (
        <div>
          <MenuItem
            emoji={VEST_MY_EMOJI}
            title={`${VEST_MY_DESCRIPTION} vesting schedules`}
            to={`/vesting-schedules/${VEST_MY_DESCRIPTION.replace(" ", "-")}`}
          />
          <MenuItem
            emoji={VEST_MY_CREATED_EMOJI}
            title={`${VEST_MY_CREATED_DESCRIPTION} vesting schedules`}
            to={`/vesting-schedules/${VEST_MY_CREATED_DESCRIPTION.replace(" ", "-")}`}
          />
        </div>
      )}
    </div>
  );
}

export default Menu;
