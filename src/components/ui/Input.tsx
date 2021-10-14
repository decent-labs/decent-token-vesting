function Input({
  title,
  status,
  value,
  type,
  min,
  disabled,
  onChange,
  onKeyDown,
}: {
  title: string,
  status: React.ReactNode,
  value: string,
  type: string,
  min: string | number | undefined,
  disabled: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined,
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> | undefined,
}) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline">
        <div className="mr-1 text-base sm:text-lg">{title}</div>
        <div className="text-xs sm:text-sm">{status}</div>
      </div>
      <input
        type={type}
        min={min}
        className={`w-full border rounded py-1 px-2 ${disabled ? "disabled" : ""}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onKeyDown={onKeyDown}
        onWheel={e => (e.target as HTMLInputElement).blur()}
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
      />
    </div>
  );
}

function InputAddress({
  title,
  status,
  value,
  disabled,
  onChange,
}: {
  title: string,
  status?: React.ReactNode,
  value: string,
  disabled: boolean,
  onChange: (newValue: string) => void,
}) {
  return (
    <Input
      title={title}
      status={status}
      value={value}
      type="text"
      min={undefined}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      onKeyDown={undefined}
    />
  );
}

function InputAmount({
  title,
  status,
  value,
  decimals,
  disabled,
  onChange,
}: {
  title: string,
  status: React.ReactNode,
  value: string,
  decimals: number | undefined,
  disabled: boolean,
  onChange: (newValue: string) => void,
}) {
  const format = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [beforeDot, afterDot] = e.target.value.split(".");

    if (!decimals || !afterDot) {
      onChange(beforeDot);
      return;
    }

    onChange(`${beforeDot}.${afterDot.substring(0, decimals)}`)
  }

  const stripChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    return ['e', '+', '-'].includes(e.key) && e.preventDefault()
  }

  return (
    <Input
      title={title}
      status={status}
      value={value}
      type="number"
      min={0}
      disabled={disabled}
      onChange={format}
      onKeyDown={stripChars}
    />
  );
}

function InputNumber({
  title,
  status,
  value,
  disabled,
  onChange,
}: {
  title: string,
  status: React.ReactNode,
  value: string,
  disabled: boolean,
  onChange: (newValue: string) => void,
}) {
  const stripChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    return ['e', '+', '-', '.'].includes(e.key) && e.preventDefault()
  }

  return (
    <Input
      title={title}
      status={status}
      value={value}
      type="number"
      min={0}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      onKeyDown={stripChars}
    />
  );
}

export {
  InputAddress,
  InputAmount,
  InputNumber,
};
