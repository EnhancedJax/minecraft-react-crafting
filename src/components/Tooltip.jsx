import { useMemo } from "react";
import { useApp } from "../provider";

export default function Tooltip() {
  const { items, inventories, showTooltip, mousePosition, heldItem } = useApp();
  const hoveredItemID = useMemo(() => {
    return inventories?.[showTooltip?.type]?.[showTooltip?.id]?.id;
  }, [showTooltip, heldItem, inventories]);
  return showTooltip.id !== null && !heldItem.id && hoveredItemID !== null ? (
    <div
      className="mc-tooltip"
      style={{
        display: "absolute",
        top: mousePosition.y,
        left: mousePosition.x,
      }}
    >
      <div className="text-xl">{items[hoveredItemID].readable}</div>
    </div>
  ) : null;
}
