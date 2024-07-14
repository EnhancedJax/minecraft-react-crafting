import InventoryGroup from "../InventoryGroup";
import Steve3D from "../Steve3D";

export default function Inventory() {
  return (
    <div
      className="flex flex-col items-center gap-3 p-5 pixelated"
      style={{
        backgroundImage: "url('/inventory.png')",
        backgroundSize: "contain",
      }}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-end h-full">
          <InventoryGroup type="armor" />
          <div className="mc-grid !h-[216px] !w-[153px] !bg-black">
            <Steve3D />
          </div>
          <div className="mc-grid "></div>
        </div>
        <div className="-mr-[6px]">
          <span className="text-2xl text-neutral-700">Crafting</span>
          <div className="flex items-center -mt-px">
            <InventoryGroup type="inventoryCrafting" />
            <div className="ml-[60px] mc-grid mt-[6px]"></div>
          </div>
        </div>
      </div>
      <InventoryGroup type="inventory" chatTarget />
      <InventoryGroup type="hotbar" />
    </div>
  );
}
