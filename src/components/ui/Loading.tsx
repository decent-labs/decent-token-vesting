import EmojiMessage from './EmojiMessage';

function LoadingMessage() {
  return (
    <EmojiMessage emoji="😐" big>
      <div className="text-xl sm:text-2xl">loading...</div>
    </EmojiMessage>
  );
}

function EmptyMessage() {
  return (
    <EmojiMessage emoji="🤷‍♂️" big>
      <div className="text-xl sm:text-2xl">holup there's nothing here</div>
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
