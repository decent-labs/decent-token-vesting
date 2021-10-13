import { Vest } from "../../data/vests";
import EmojiMessage from "./EmojiMessage";

function Status({
  vest,
  big = false,
}: {
  vest: Vest,
  big?: boolean,
}) {
  return (
    <EmojiMessage emoji={vest.statusEmoji} className={big ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}>
      {vest.statusDescription}
    </EmojiMessage>
  );
}

export default Status;
