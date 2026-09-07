import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CheeseRoyale } from "@/components/game/CheeseRoyale";
import "@/styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Cheese Royale root missing");

createRoot(root).render(
  <StrictMode>
    <CheeseRoyale />
  </StrictMode>,
);
