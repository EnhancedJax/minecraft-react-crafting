import { INVENTORIES } from "../constants";
import Chat from "./Chat";
import InventorySlots from "./InventorySlots";
import { InventoryProvider } from "./InventorySlots/provider";

export default function InventoryGroup({ type, size, chatTarget }) {
  return (
    <div className="w-min">
      <InventoryProvider type={type}>
        <InventorySlots
          rows={INVENTORIES?.[type]?.rows || size[0]}
          cols={INVENTORIES?.[type]?.cols || size[1]}
        />
        {chatTarget && <Chat />}
      </InventoryProvider>
    </div>
  );
}
