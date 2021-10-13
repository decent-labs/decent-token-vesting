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
      <div className="mr-2">
        <Emoji emoji={vest.statusEmoji} big={big} />
      </div>
      {vest.statusDescription}
    </div>
  );
}

export default Status;
