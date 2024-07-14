import InventoryGroup from "../InventoryGroup";

export default function Inventory() {
  return (
    <div
      className="flex flex-col items-center gap-3 p-5 pixelated"
      style={{
        backgroundImage: "url('/chest.png')",
        backgroundSize: "contain",
      }}
    >
      <div
        className="h-[14px] text-left w-full text-[#404040] text-xl"
        style={{
          transform: "translateY(-5px)",
        }}
      >
        Chest
      </div>
      <InventoryGroup type="chest" />
      <div
        className="h-[14px] text-left w-full text-[#404040] text-xl"
        style={{
          transform: "translateY(-5px)",
        }}
      >
        Inventory
      </div>
      <InventoryGroup type="inventory" chatTarget />
      <InventoryGroup type="hotbar" />
    </div>
  );
}
