import { useApp } from "../../provider";
import StackSizeNumber from "./containers/StackSizeNumber";
import { useInventory } from "./provider";

export default function Inventory({ rows = 4, cols = 9 }) {
  const {
    type,
    inventory,
    draggedSlots,
    handleMouseOver,
    handleMouseDown,
    handleMouseUp,
  } = useInventory();

  const { items } = useApp();

  return (
    <div
      className="relative grid p-4 bg-neutral-200"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {inventory.map(({ id, count }, slotIndex) => (
        <div
          key={slotIndex}
          className={`mc-grid type-${type} relative w-[54px] h-[54px] cursor-pointer ${
            draggedSlots.includes(slotIndex) && id !== null && "opacity-50"
          }`} // position of class name mc-grid and type used for quick access. Don't change
          onMouseOver={() => handleMouseOver(slotIndex)}
          onMouseDown={(e) => handleMouseDown(e, slotIndex)}
          onMouseUp={(e) => handleMouseUp(e, slotIndex)}
        >
          {id !== null && (
            <>
              <img
                src={items[id]?.texture}
                alt={items[id]?.readable}
                className="object-cover w-full h-full"
              />
              <StackSizeNumber count={count} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
