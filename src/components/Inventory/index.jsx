import { useEffect } from "react";
import { useInventory } from "./provider";

export default function Inventory() {
  const {
    items,
    inventory,
    heldItem,
    mousePosition,
    draggedSlots,
    isLastRightClick,
    isDragging,
    handleMouseOver,
    handleMouseDown,
    handleMouseUp,
    insertInventoryItem,
  } = useInventory();

  useEffect(() => {
    insertInventoryItem([
      { id: 0, count: 64 },
      { id: 104, count: 23 },
      { id: 0, count: 4 },
      { id: 739, count: 1 },
      { id: 739, count: 1 },
      { id: 739, count: 1 },
      { id: 958, count: 10 },
    ]);
  }, []);

  const StackSizeNumber = ({ count }) => {
    return (
      <>
        {count > 1 && (
          <div className="absolute rounded pointer-events-none -bottom-2 -right-1 text-neutral-800">
            {count}
            <span className="absolute -top-[2px] -left-[2px] text-white rounded">
              {count}
            </span>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="relative grid grid-cols-9 grid-rows-4 p-4 bg-neutral-200">
      {inventory.map(({ id, count }, slotIndex) => (
        <div
          key={slotIndex}
          className={`relative w-[36px] h-[36px] cursor-pointer mc-grid ${
            draggedSlots.includes(slotIndex) && id !== null && "opacity-50"
          }`}
          id="slot"
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
      {heldItem.id !== null && (
        <div
          style={{
            position: "fixed",
            left: mousePosition.x - 18,
            top: mousePosition.y - 18,
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <img
            src={items[heldItem.id]?.texture}
            alt={items[heldItem.id]?.readable}
            className="w-[36px] h-[36px] object-cover"
          />
          <div
            style={{
              display: isDragging
                ? !isLastRightClick
                  ? "none"
                  : "block"
                : "block",
            }}
          >
            <StackSizeNumber count={heldItem.count} />
          </div>
        </div>
      )}
    </div>
  );
}
