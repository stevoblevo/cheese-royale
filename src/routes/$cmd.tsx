import { createFileRoute } from "@tanstack/react-router";
import { CheeseRoyale } from "@/components/game/CheeseRoyale";

export const Route = createFileRoute("/$cmd")({ component: Cmd });

function Cmd() {
  return <CheeseRoyale />;
}
