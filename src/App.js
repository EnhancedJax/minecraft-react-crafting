import { useEffect } from "react";
import Pickup from "./components/Inventory/containers/Pickup";
import InventoryGroup from "./components/InventoryGroup";
import Scene from "./components/Steve3D";
import Tooltip from "./components/Tooltip";
import { AppProvider } from "./provider";

function App() {
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }, []);
  return (
    <main className="flex w-screen h-screen overflow-hidden bg-neutral-600 flex-center">
      <AppProvider>
        <div className="flex flex-col items-center gap-3 p-3 border-4 border-black rounded-xl bg-[#C6C6C6]">
          <div className="flex justify-between w-full">
            <div className="flex items-end h-full">
              <InventoryGroup type="armor" />
              <div className="mc-grid !h-[216px] !w-[150px] !bg-black">
                <Scene />
              </div>
              <div className="mc-grid "></div>
            </div>
            <div className="">
              <span className="text-2xl text-neutral-700">Crafting</span>
              <div className="flex items-center">
                <InventoryGroup type="craftingTable" />
                <span className="mx-2 text-3xl">-{">"}</span>
                <div className="mc-grid "></div>
              </div>
            </div>
          </div>
          <InventoryGroup type="chest" chatTarget />
          <InventoryGroup type="player" />
        </div>
        <Pickup />
        <Tooltip />
      </AppProvider>
    </main>
  );
}

export default App;
