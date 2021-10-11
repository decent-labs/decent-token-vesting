function Emoji({
  emoji,
}: {
  emoji: string,
}) {
  return (
    <div className="text-xl sm:text-2xl">{emoji}</div>
  )
}

export default Emoji;
