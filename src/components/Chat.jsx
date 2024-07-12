import { useState } from "react";
import { useInventory } from "./Inventory/provider";

export default function Chat() {
  const { items, insertInventoryItem } = useInventory();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error) setError(false);
  };

  const handleInputSubmit = (e) => {
    if (e.key === "Enter") {
      const [i, c] = inputValue.split(" ");
      const item = i.startsWith("minecraft:") ? i : `minecraft:${i}`;
      const count = c || 1;
      const noInput = !inputValue;
      const noItem = !item;
      const itemNotFound = !items.find((i) => i.id === item);
      const invalidCount = isNaN(count) || count < 1;
      if (noInput || noItem || itemNotFound || invalidCount) {
        setError(true);
      } else {
        const itemIndex = items.findIndex((i) => i.id === item);
        setError(false);
        insertInventoryItem([{ id: itemIndex, count: count }]);
        setInputValue("");
      }
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-screen p-2 text-xs text-white bg-black bg-opacity-50">
      <span className="mr-2">/give @s</span>
      <input
        className={`bg-transparent ${error ? "text-red-500" : "text-white"}`}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputSubmit}
      />
    </div>
  );
}
