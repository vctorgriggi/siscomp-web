import ReactDOM from "react-dom/client";
import React from "react";

import App from "./App.jsx";
import "./index.css";

/* check if the environment variable VITE_API_URL is defined */
if (!import.meta.env.VITE_API_URL) {
  console.error("API Url is not defined in the environment variables.");
  throw new Error(
    "API Url is not defined in the environment variables. Please define it in the .env file."
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
