import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { IsUserLoginContextProvider } from "./context/isUserLogged";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <IsUserLoginContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IsUserLoginContextProvider>
  </React.StrictMode>
);
