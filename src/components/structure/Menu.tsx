import { Link, useRouteMatch } from 'react-router-dom';
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
    <Link to={to} className="hover:no-underline">
      <div className={`py-2 sm:pr-4 text-right flex flex-col items-center sm:block ${match ? "font-bold" : ""}`}>
        <div className="text-xl sm:text-2xl">{emoji}</div>
        <div className="hidden sm:block">{title}</div>
      </div>
    </Link>
  );
}

function Separator() {
  return (
    <div className="border-b pt-2 mb-2" />
  );
}

function Menu() {
  const { account } = useWeb3();

  return (
    <div className="-my-2">
      {account && (
        <div>
          <MenuItem
            emoji="⏲"
            title="Create new vest"
            to="/vests/new"
          />
          <Separator />
        </div>
      )}
      <MenuItem
        emoji="👨‍👩‍👧‍👦"
        title="All vests"
        to="/vests/all"
      />
      <MenuItem
        emoji="🤑"
        title="My vests"
        to="/vests/my"
      />
      <MenuItem
        emoji="🎨"
        title="My created vests"
        to="/vests/my-created"
      />
    </div>
  );
}

export default Menu;
