function Container({
  children,
}:{
  children: React.ReactNode,
}) {
  return (
    <div className="bg-purple-100 p-4 border rounded">
      {children}
    </div>
  );
}

export default Container;
