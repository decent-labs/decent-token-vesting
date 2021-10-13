import Emoji from "./Emoji";

function EmojiMessage({
  emoji,
  children,
  big = false,
  className = "",
  reverse = false,
}: {
  emoji: string,
  children: React.ReactNode,
  big?: boolean
  className?: string
  reverse?: boolean
}) {
  return (
    <div className={`flex items-center ${reverse ? "flex-row-reverse" : ""} ${className}`}>
      <div className={`${reverse ? "ml-2" : "mr-2"}`}>
        <Emoji emoji={emoji} big={big} />
      </div>
      {children}
    </div>
  );
}

export default EmojiMessage;
