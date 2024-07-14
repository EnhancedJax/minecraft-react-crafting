import { useState } from "react";
import { useApp } from "../provider";
import { getImageDimensions } from "../utils/chat";
import { useInventory } from "./InventorySlots/provider";

export default function Chat() {
  const { type } = useInventory();
  const { items, insertInventoryItem, setSkin } = useApp();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error) setError(false);
  };

  const handleInputSubmit = (e) => {
    if (e.key === "Enter") {
      if (!inputValue) {
        setError("Invalid command");
      }
      const args = inputValue.split(" ");
      const cmd = args[0];

      if (cmd === "give" && args[2]) {
        handleGiveCommand(args[2], args[3]);
      } else if (cmd === "skin" && args[1]) {
        handleSetSkinCommand(args[1]);
      } else {
        setError("Invalid command");
      }
    }
  };

  const handleGiveCommand = (item, c) => {
    const count = c || 1;
    const itemIndex = items.findIndex((i) => i.name === item);
    const itemNotFound = itemIndex === -1;
    const invalidCount = isNaN(count) || count < 1;
    if (itemNotFound || invalidCount) {
      setError("Not such item, or invalid count");
    } else {
      setError(null);
      insertInventoryItem([{ id: itemIndex, count: count }], type);
      setInputValue("");
    }
  };

  const handleSetSkinCommand = async (skin) => {
    const skinURL = `https://mineskin.eu/skin/${skin}`;
    const imgDim = await getImageDimensions(skinURL);
    if (imgDim.width === 0) {
      setError("No such player with name");
    } else if (imgDim.height !== 64 && imgDim.height !== 64) {
      setError("Invalid skin size (64x64 required)");
    } else {
      setSkin(skinURL);
      setError(null);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-screen p-2 text-lg text-white bg-black bg-opacity-50">
      <span className="">/</span>
      <input
        className={`bg-transparent ${
          error ? "text-red-300" : "text-white"
        } w-max`}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputSubmit}
      />
      <span className="absolute text-red-500 right-2">{error}</span>
    </div>
  );
}
