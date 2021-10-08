function MenuItem({
  title,
}: {
  title: string
}) {
  return (
    <div className="py-4">
      {title}
    </div>
  );
}

function LeftMenu() {
  return (
    <div className="border-r pt-4 pr-4">
      <div className="-my-4">
        <MenuItem title="All vests" />
        <MenuItem title="My created vests" />
        <MenuItem title="My claimable vests" />
      </div>
    </div>
  );
}

export default LeftMenu;
