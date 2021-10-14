import EmojiMessage from './EmojiMessage';

function LoadingMessage() {
  return (
    <EmojiMessage emoji="😐" size="big">
      loading...
    </EmojiMessage>
  );
}

function EmptyMessage() {
  return (
    <EmojiMessage emoji="🤷‍♂️" size="big">
      holup there's nothing here
    </EmojiMessage>
  );
}

function Loading({
  loading,
  dataExists,
  children,
}: {
  loading: boolean,
  dataExists: boolean,
  children: React.ReactNode,
}) {
  if (loading) {
    return (
      <div>
        {dataExists && (
          <div className="mb-4">{children}</div>
        )}
        <LoadingMessage />
      </div>
    );
  }

  if (!dataExists) {
    return (
      <EmptyMessage />
    );
  }

  return (
    <div>
      {children}
    </div>
  );
}

export default Loading;
