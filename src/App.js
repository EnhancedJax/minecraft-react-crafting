import { useEffect, useState } from "react";
import Pickup from "./components/InventorySlots/containers/Pickup";
import Screens from "./components/Screens";
import Tooltip from "./components/Tooltip";
import { AppProvider } from "./provider";

function App() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }, []);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(
        window.innerWidth < window.innerHeight && window.innerWidth < 1024
      );
    };
    handleOrientationChange();

    // Add the event listener for orientation change
    window.addEventListener("resize", handleOrientationChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  return (
    <main className="w-screen h-screen bg-black">
      <div
        className="absolute inset-0 bg-center bg-cover opacity-50 blur-xl "
        style={{
          backgroundImage:
            "url('https://staticg.sportskeeda.com/editor/2022/03/39c77-16481589742015-1920.jpg')",
        }}
      />
      <span className="absolute text-xs text-center text-pink-300 -translate-x-1/2 opacity-30 top-4 left-1/2">
        Not affiliated with Mojang Studios, item textures are property of Mojang
        Studios
      </span>
      {isPortrait ? (
        <div className="absolute inset-0 flex flex-col gap-2 text-white bg-black flex-center bg-opacity-70 animate-pulse">
          <img
            src="crafting_table_front.png"
            alt="logo"
            className="w-12 h-12 pixelated "
          />
          <span className="text-xl ">Please rotate your device!</span>
        </div>
      ) : (
        <AppProvider>
          <div className="flex w-screen h-screen gap-8 flex-center sm:flex-col xl:scale-75">
            <Screens />
            <Pickup />
            <Tooltip />
          </div>
        </AppProvider>
      )}
    </main>
  );
}

export default App;
