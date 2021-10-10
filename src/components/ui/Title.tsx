function Title({
  title,
}: {
  title: string,
}) {
  return (
    <div className="text-xl sm:text-2xl mb-4 mr-4">
      {title}
    </div>
  );
}

export default Title;
