import { Vest } from "../../data/vests";
import EmojiMessage from "./EmojiMessage";

function Status({
  vest,
  size,
}: {
  vest: Vest,
  size?: "big" | "bigger" | "biggest"
}) {
  return (
    <EmojiMessage emoji={vest.statusEmoji} size={size}>
      {vest.statusDescription}
    </EmojiMessage>
  );
}

export default Status;
