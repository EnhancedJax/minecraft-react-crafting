import { useEffect } from "react";
import Chat from "./components/Chat";
import Inventory from "./components/Inventory";
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
        <InventoryProvider
          type="chest"
          defaultInventory={[
            { id: 0, count: 64 },
            { id: 104, count: 23 },
            { id: 0, count: 4 },
            { id: 739, count: 1 },
            { id: 958, count: 10 },
          ]}
        >
          <Inventory />
        </InventoryProvider>
        <InventoryProvider type="player">
          <Inventory />
          <Chat />
        </InventoryProvider>
        <Pickup />
      </AppProvider>
    </main>
  );
}

export default App;
