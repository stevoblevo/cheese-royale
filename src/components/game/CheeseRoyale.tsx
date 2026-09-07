import { useEffect } from "react";
import { useGame } from "@/game/store";
import { TitleScreen } from "./TitleScreen";
import { CharacterSelect } from "./CharacterSelect";
import { PlayTable } from "./PlayTable";
import { ListenMode } from "./ListenMode";
import { FoldedOutlet } from "./FoldedOutlet";
import { CineBoard } from "./CineBoard";
import { PicBing } from "./PicBing";
import { WinScreen } from "./WinScreen";

function seatFromLocation() {
  if (typeof window === "undefined") return null;
  const blob = `${window.location.pathname} ${window.location.hash} ${window.location.search}`.toLowerCase();
  if (/\bfreppy\b|\bgreen[-_ ]?player\b/.test(blob)) return "freppy";
  if (/\bknight\b/.test(blob)) return "knight";
  return null;
}

export function CheeseRoyale() {
  const screen = useGame((s) => s.screen);

  useEffect(() => {
    const seat = seatFromLocation();
    if (!seat) return;
    const s = useGame.getState();
    if (s.screen === "title") s.startCine(seat);
  }, []);
  if (screen === "select") return <CharacterSelect />;
  if (screen === "play") return <PlayTable />;
  if (screen === "listen") return <ListenMode />;
  if (screen === "fold") return <FoldedOutlet />;
  if (screen === "cine") return <CineBoard />;
  if (screen === "bing") return <PicBing />;
  if (screen === "won") return <WinScreen />;
  return <TitleScreen />;
}
