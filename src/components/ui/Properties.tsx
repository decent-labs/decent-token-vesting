function Property({
  title,
  children,
}: {
  title: string,
  children: React.ReactNode,
}) {
  return (
    <div className="my-4">
      <div className="text-lg sm:text-xl">{title}</div>
      {children}
    </div>
  );
}

function AmountProperty({
  title,
  value,
  symbol,
}: {
  title: string,
  value: string | undefined,
  symbol: string,
}) {
  return (
    <Property title={title}>
      <span className="font-mono text-xs sm:text-sm">{value}</span> <span>{symbol}</span>
    </Property>
  );
}

export {
  Property,
  AmountProperty,
}
