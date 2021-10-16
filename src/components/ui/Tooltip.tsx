import Tippy from '@tippyjs/react';

function Tooltip(
  {
    tooltip,
    children,
  }: {
    tooltip: React.ReactNode,
    children: React.ReactNode,
  }
) {
  return (
    <Tippy
      content={
        <div className="bg-purple-50 p-2 border rounded shadow">
          {tooltip}
        </div>
      }
    >
      <div>{children}</div>
    </Tippy>
  );
}

export default Tooltip;
