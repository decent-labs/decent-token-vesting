import Emoji from './Emoji';

function LoadingMessage() {
  return (
    <div className="flex">
      <div className="mr-2">
        <Emoji emoji="😐" />
      </div>
      <div className="text-xl sm:text-2xl">loading...</div>
    </div>
  );
}

function EmptyMessage() {
  return (
    <div className="flex">
      <div className="mr-2">
        <Emoji emoji="🤷‍♂️" />
      </div>
      <div className="text-xl sm:text-2xl">holup there's nothing here</div>
    </div>
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
