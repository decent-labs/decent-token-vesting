function Emoji({
  emoji,
  big,
}: {
  emoji: string,
  big?: boolean,
}) {
  if (big) {
    return (
      <div className="text-3xl sm:text-4xl">{emoji}</div>
    );
  }

  return (
    <div className="text-xl sm:text-2xl">{emoji}</div>
  )
}

export default Emoji;
