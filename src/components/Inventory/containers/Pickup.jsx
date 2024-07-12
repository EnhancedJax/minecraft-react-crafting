import { useApp } from "../../../provider";
import StackSizeNumber from "./StackSizeNumber";

export default function Pickup() {
  const { items, mousePosition, heldItem, isLeftDragging } = useApp();
  return (
    <>
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
            className="w-[54px] h-[54px] object-cover"
          />
          <div
            style={{
              display: isLeftDragging ? "none" : "block",
            }}
          >
            <StackSizeNumber count={heldItem.count} />
          </div>
        </div>
      )}
    </>
  );
}
