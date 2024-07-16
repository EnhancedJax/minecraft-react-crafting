import { SCREENS } from "../constants";
import { useApp } from "../provider";

export default function Screens() {
  const { screen, setScreen } = useApp();

  const handleClick = (index) => {
    SCREENS[index].sound.play();
    setScreen(index);
    document.title = SCREENS[index].name;
  };

  return (
    <>
      {SCREENS[screen].component}
      <div className="flex flex-col gap-2">
        {SCREENS.map((thisScreen, index) => (
          <button
            key={thisScreen.name}
            className="mc-button"
            onClick={() => {
              handleClick(index);
            }}
          >
            {thisScreen.name}
          </button>
        ))}
        <div className="flex">
          <button
            className="mc-button mc-button-icon"
            onClick={() =>
              window.open(
                "https://github.com/EnhancedJax/minecraft-react-crafting",
                "_blank"
              )
            }
          >
            <img src="github.png" className="w-8 h-8 invert" />
          </button>
        </div>
      </div>
    </>
  );
}
