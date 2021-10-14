function EmojiMessage({
  emoji,
  children,
  reverse = false,
  size,
}: {
  emoji: string,
  children: React.ReactNode,
  reverse?: boolean,
  size?: "big" | "bigger" | "biggest",
}) {
  let sizeClasses = "";
  switch (size) {
    case "big": sizeClasses = "text-lg sm:text-xl"; break;
    case "bigger": sizeClasses = "text-xl sm:text-2xl"; break;
    case "biggest": sizeClasses = "text-2xl sm:text-3xl"; break;
    default: break;
  }

  let emojiSizeClasses = "text-lg sm:text-xl";
  switch (size) {
    case "big": emojiSizeClasses = "text-xl sm:text-2xl"; break;
    case "bigger": emojiSizeClasses = "text-2xl sm:text-3xl"; break;
    case "biggest": emojiSizeClasses = "text-3xl sm:text-4xl"; break;
    default: break;
  }

  return (
    <div className={`flex items-center ${reverse ? "flex-row-reverse" : ""} ${sizeClasses}`}>
      <div className={`${reverse ? "ml-2" : "mr-2"}`}>
        <div className={emojiSizeClasses}>{emoji}</div>
      </div>
      {children}
    </div>
  );
}

export default EmojiMessage;
