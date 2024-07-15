import CraftingResultSlot from "../CraftingResultSlot";
import InventoryGroup from "../InventoryGroup";

export default function Inventory() {
  return (
    <div
      className="flex flex-col items-center gap-3 p-5 pixelated"
      style={{
        backgroundImage: "url('/crafting_table.png')",
        backgroundSize: "contain",
      }}
    >
      <div
        className="h-[14px] text-left w-full ml-[132px] text-[#404040] text-xl"
        style={{
          transform: "translateY(-5px)",
        }}
      >
        Crafting
      </div>
      <div className="flex w-full ml-[132px] items-center">
        <InventoryGroup type="craftingTable" />
        <CraftingResultSlot
          type="craftingTableResult"
          resultOfType="craftingTable"
          size={77}
          className="ml-[106px] mt-[2px] "
        />
      </div>

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
