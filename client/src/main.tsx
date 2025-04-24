import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Import the App component
import "./index.css"; // Import global styles (if any)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);