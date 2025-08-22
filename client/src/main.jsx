// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { AuthProvider } from "../context/AuthContext"; // fix path
import { setAuthToken } from "../services/api"; // ✅ import
import "./index.css";


// ✅ Attach token from localStorage if user is logged in
const user = JSON.parse(localStorage.getItem("user"));
if (user?.token) {
  setAuthToken(user.token);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>

      <App />

    </AuthProvider>
  </React.StrictMode>
);
