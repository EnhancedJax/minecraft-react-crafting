import { useState } from "react";
import { EMPTY_ITEM } from "./InventorySlots/constants";
import SpecialSlot from "./SpecialSlot";

export default function CraftingResultSlot({
  resultOfType,
  className,
  ...props
}) {
  const [resultItem, setResultItem] = useState(EMPTY_ITEM);

  return (
    <SpecialSlot
      className={className}
      {...props}
      item={resultItem}
      pickUpCallback={() => {
        setResultItem(EMPTY_ITEM);
      }}
      canPutDown={() => false}
    />
  );
}
