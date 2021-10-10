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
      <div className={`px-2 sm:px-0 py-2 sm:pr-4 ${match ? "font-bold" : ""}`}>
        {title}
      </div>
    </Link>
  );
}

function Separator() {
  return (
    <div className="border-r sm:border-r-0 sm:border-b sm:pt-2 sm:mb-2" />
  );
}

function Menu() {
  return (
    <div className="-mx-2 sm:mx-0 sm:-my-2 flex sm:block">
      <MenuItem
        title="Create new vest"
        to="/vests/new"
      />
      <Separator />
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
