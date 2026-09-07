import { createFileRoute } from "@tanstack/react-router";
import { CheeseRoyale } from "@/components/game/CheeseRoyale";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CheeseRoyale />;
}
