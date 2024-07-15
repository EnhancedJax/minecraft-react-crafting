import { INVENTORIES } from "../constants";
import Chat from "./Chat";
import InventorySlots from "./InventorySlots";
import { InventoryProvider } from "./InventorySlots/provider";

export default function InventoryGroup({
  type,
  chatTarget,
  pickUpCallback = () => {},
  allowRightClickPickup = true,
  canPutDown = () => true,
  ...props
}) {
  return (
    <div className="w-min">
      <InventoryProvider
        type={type}
        pickUpCallback={pickUpCallback}
        allowRightClickPickup={allowRightClickPickup}
        canPutDown={canPutDown}
      >
        <InventorySlots
          {...props}
          rows={INVENTORIES?.[type]?.rows}
          cols={INVENTORIES?.[type]?.cols}
        />
        {chatTarget && <Chat />}
      </InventoryProvider>
    </div>
  );
}
