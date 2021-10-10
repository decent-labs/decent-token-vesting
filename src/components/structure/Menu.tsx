import { Link, useRouteMatch } from 'react-router-dom';

function MenuItem({
  title,
  to,
}: {
  title: string,
  to: string,
}) {
  const match = useRouteMatch(to);

  return (
    <Link to={to}>
      <div className={`py-2 ${match ? "font-bold" : ""}`}>
        {title}
      </div>
    </Link>
  );
}

function Menu() {
  return (
    <div className="border-r pt-4 pr-4 flex-none w-40">
      <div className="-my-2">
        <MenuItem
          title="All vests"
          to="/vests/all"
        />
        <MenuItem
          title="My vests"
          to="/vests/my"
        />
        <MenuItem
          title="My created vests"
          to="/vests/my-created"
        />
      </div>
    </div>
  );
}

export default Menu;
