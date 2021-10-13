function Title({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <div className="text-xl sm:text-2xl mb-4 mr-4">
      {children}
    </div>
  );
}

export default Title;
