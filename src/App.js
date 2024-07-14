import { useEffect } from "react";
import Pickup from "./components/InventorySlots/containers/Pickup";
import Screens from "./components/Screens";
import Tooltip from "./components/Tooltip";
import { AppProvider } from "./provider";

function App() {
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }, []);
  return (
    <main className="flex w-screen h-screen gap-8 overflow-hidden bg-neutral-800 flex-center">
      <AppProvider>
        <Screens />
        <Pickup />
        <Tooltip />
      </AppProvider>
    </main>
  );
}

export default App;
