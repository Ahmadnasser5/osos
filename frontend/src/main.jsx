// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App.jsx";
import { applyDirection } from "./i18n";

applyDirection(localStorage.getItem("lang") || "en");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
