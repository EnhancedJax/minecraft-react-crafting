import { SCREENS } from "../constants";
import { useApp } from "../provider";

export default function Screens() {
  const { screen, setScreen } = useApp();
  return (
    <>
      {SCREENS[screen].component}
      <div className="flex flex-col gap-2">
        {SCREENS.map((thisScreen, index) => (
          <button
            key={thisScreen.name}
            className="mc-button"
            onClick={() => setScreen(index)}
          >
            {thisScreen.name}
          </button>
        ))}
      </div>
    </>
  );
}
