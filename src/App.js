import { useEffect } from "react";
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
      </InventoryProvider>
    </main>
  );
}

export default App;
