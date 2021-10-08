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

function LeftMenu() {
  return (
    <div className="border-r pt-4 pr-4 w-44">
      <div className="-my-2">
        <MenuItem
          title="All vests"
          to="/all-vests"
        />
        <MenuItem
          title="My vests"
          to="/my-vests"
        />
        <MenuItem
          title="My created vests"
          to="/my-created-vests"
        />
      </div>
    </div>
  );
}

export default LeftMenu;
