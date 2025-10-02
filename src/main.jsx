import { ApiProvider } from "./api/ApiContext.jsx";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <ApiProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApiProvider>
);
