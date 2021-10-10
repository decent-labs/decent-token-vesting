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
      <div className={`px-2 sm:px-0 sm:py-2 ${match ? "font-bold" : ""}`}>
        {title}
      </div>
    </Link>
  );
}

function Menu() {
  return (
    <div className="-mx-2 sm:mx-0 sm:-my-2 flex sm:block">
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
  );
}

export default Menu;
