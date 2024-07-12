import { useEffect } from "react";
import Chat from "./components/Chat";
import Inventory from "./components/Inventory";
import { PLAYER_DEFAULT_INVENTORY } from "./components/Inventory/constants";
import Pickup from "./components/Inventory/containers/Pickup";
import { InventoryProvider } from "./components/Inventory/provider";
import { AppProvider } from "./provider";

function App() {
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }, []);
  return (
    <main className="flex-col w-screen h-screen overflow-hidden bg-neutral-600 flex-center">
      <AppProvider>
        <InventoryProvider type="craftingTable">
          <Inventory rows="3" cols="3" />
        </InventoryProvider>
        <InventoryProvider type="chest">
          <Inventory />
        </InventoryProvider>
        <InventoryProvider
          type="player"
          defaultInventory={PLAYER_DEFAULT_INVENTORY}
        >
          <Inventory rows="1" />
          <Chat />
        </InventoryProvider>
        <Pickup />
      </AppProvider>
    </main>
  );
}

export default App;
