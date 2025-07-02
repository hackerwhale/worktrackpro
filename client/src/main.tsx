import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/layout/theme-provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="worktrack-theme">
    <App />
  </ThemeProvider>
);
