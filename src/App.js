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
    <main className="flex w-screen h-screen gap-8 overflow-hidden bg-black flex-center">
      <div
        className="absolute inset-0 bg-center bg-cover opacity-50 blur-xl "
        style={{
          backgroundImage:
            "url('https://staticg.sportskeeda.com/editor/2022/03/39c77-16481589742015-1920.jpg')",
        }}
      />
      <span className="absolute text-xs text-pink-300 opacity-30 top-4">
        Not affiliated with Mojang Studios, item textures are property of Mojang
        Studios
      </span>
      {/* <div className=""> */}
      <AppProvider>
        <Screens />
        <Pickup />
        <Tooltip />
      </AppProvider>
      {/* </div> */}
    </main>
  );
}

export default App;
