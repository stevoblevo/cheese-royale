import { useGame } from "@/game/store";
import { TitleScreen } from "./TitleScreen";
import { CharacterSelect } from "./CharacterSelect";
import { PlayTable } from "./PlayTable";
import { ListenMode } from "./ListenMode";
import { FoldedOutlet } from "./FoldedOutlet";
import { CineBoard } from "./CineBoard";
import { PicBing } from "./PicBing";
import { WinScreen } from "./WinScreen";

export function CheeseRoyale() {
  const screen = useGame((s) => s.screen);
  if (screen === "select") return <CharacterSelect />;
  if (screen === "play") return <PlayTable />;
  if (screen === "listen") return <ListenMode />;
  if (screen === "fold") return <FoldedOutlet />;
  if (screen === "cine") return <CineBoard />;
  if (screen === "bing") return <PicBing />;
  if (screen === "won") return <WinScreen />;
  return <TitleScreen />;
}
