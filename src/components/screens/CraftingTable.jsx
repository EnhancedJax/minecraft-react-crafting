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
      <div className="flex w-full my-[26px] ml-[132px] items-center">
        <InventoryGroup type="craftingTable" />
        <CraftingResultSlot
          resultOfType="craftingTable"
          size={77}
          className="ml-[106px] mt-[2px] "
        />
      </div>
      <InventoryGroup type="inventory" chatTarget />
      <InventoryGroup type="hotbar" />
    </div>
  );
}
