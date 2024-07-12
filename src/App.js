import { useEffect } from "react";
import Chat from "./components/Chat";
import Inventory from "./components/Inventory";
import { InventoryProvider } from "./components/Inventory/provider";

function App() {
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }, []);
  return (
    <main className="w-screen h-screen overflow-hidden bg-neutral-600 flex-center">
      <InventoryProvider index={0}>
        <Inventory />
        <Chat />
      </InventoryProvider>
    </main>
  );
}

export default App;
