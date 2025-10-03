import { ApiProvider } from "./api/ApiContext.jsx";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import React from "react";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApiProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApiProvider>
  </React.StrictMode>
);
