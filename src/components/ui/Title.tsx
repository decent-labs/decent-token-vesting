import Loading from '../ui/Loading';

function Title({
  title,
  isLoading,
}: {
  title: string,
  isLoading: boolean,
}) {
  return (
    <div className="flex items-baseline">
      <div className="text-3xl mb-4 mr-4">
        {title}
      </div>
      {isLoading && <Loading />}
    </div>
  );
}

export default Title;
