import { Vest } from "../../data/vests";
import Emoji from "./Emoji";

function Status({
  vest,
  big = false,
}: {
  vest: Vest,
  big?: boolean,
}) {
  return (
    <div className={`flex items-center ${big ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
      <Emoji emoji={vest.statusEmoji} big={big} />
      <div className="ml-2">{vest.statusDescription}</div>
    </div>
  );
}

export default Status;
