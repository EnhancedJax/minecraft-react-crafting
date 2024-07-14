import { useApp } from "../../provider";
import StackSizeNumber from "./containers/StackSizeNumber";
import { useInventory } from "./provider";

export default function InventorySlots({ rows = 4, cols = 9 }) {
  const {
    type,
    inventory,
    draggedSlots,
    handleMouseOver,
    handleMouseDown,
    handleMouseUp,
  } = useInventory();

  const { items, handleMouseEnter, handleMouseLeave } = useApp();

  return (
    <div
      className="relative grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {inventory.map(({ id, count }, slotIndex) => (
        <div
          key={slotIndex}
          className={`mc-grid type-${type} relative ${
            draggedSlots.includes(slotIndex) && id !== null && "opacity-50"
          }`} // position of class name mc-grid and type used for quick access. Don't change
          onMouseOver={() => handleMouseOver(slotIndex)}
          onMouseDown={(e) => handleMouseDown(e, slotIndex)}
          onMouseUp={(e) => handleMouseUp(e, slotIndex)}
          onMouseEnter={() => handleMouseEnter(slotIndex, type)}
          onMouseLeave={() => handleMouseLeave()}
        >
          {id !== null && (
            <>
              <img
                src={items[id]?.texture}
                alt={items[id]?.readable}
                className="object-cover w-full h-full pixelated"
              />
              <StackSizeNumber count={count} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
