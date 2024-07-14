import { useApp } from "../provider";
import { EMPTY_ITEM } from "./InventorySlots/constants";
import StackSizeNumber from "./InventorySlots/containers/StackSizeNumber";

export default function SpecialSlot({
  bgImg = "",
  size = 54,
  item = EMPTY_ITEM,
  pickUpCallback = () => {},
  putDownCallback = () => {},
  canPutDown = () => true,
  children = null,
  className = "",
  ...props
}) {
  const { items, handleMouseEnter, handleMouseLeave, setHeldItem, heldItem } =
    useApp();
  return (
    <div
      className={`relative mc-grid ${className}`}
      {...props}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        padding: `${(size - 54) / 2}px`,
      }}
      onClick={(e) => {
        if (heldItem.id === null) {
          setHeldItem(item);
          pickUpCallback();
        } else if (canPutDown(heldItem, item)) {
          setHeldItem(item);
          putDownCallback(heldItem);
        }
      }}
      onMouseEnter={() => handleMouseEnter(null, null, item.id)}
      onMouseLeave={() => handleMouseLeave()}
    >
      {item.id !== null && (
        <>
          <img
            src={items[item.id]?.texture}
            alt={items[item.id]?.readable}
            className="object-cover w-full h-full pixelated"
          />
          <StackSizeNumber
            count={item.count}
            style={{
              margin: `${(size - 54) / 2}px`,
            }}
          />
        </>
      )}
    </div>
  );
}
