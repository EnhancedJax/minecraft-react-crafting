import { useApp } from "../provider";

export default function Tooltip() {
  const { tooltip, mousePosition } = useApp();
  return tooltip ? (
    <div
      className="mc-tooltip"
      style={{
        display: "absolute",
        top: mousePosition.y,
        left: mousePosition.x,
      }}
    >
      <div className="text-xl">{tooltip}</div>
    </div>
  ) : null;
}
