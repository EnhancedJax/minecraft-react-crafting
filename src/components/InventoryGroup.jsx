import { INVENTORIES } from "../constants";
import Chat from "./Chat";
import Inventory from "./Inventory";
import { InventoryProvider } from "./Inventory/provider";

export default function InventoryGroup({ type, size, chatTarget }) {
  return (
    <div className="w-min">
      <InventoryProvider type={type}>
        <Inventory
          rows={INVENTORIES?.[type]?.rows || size[0]}
          cols={INVENTORIES?.[type]?.cols || size[1]}
        />
        {chatTarget && <Chat />}
      </InventoryProvider>
    </div>
  );
}
