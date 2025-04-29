import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import axios from "axios";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/cosmo/bootstrap.min.css";
import "./index.css";

axios.interceptors.response.use(
  (response) => {
    const token = response.headers["access-token"];
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return response;
  },
  (error) => Promise.reject(error)
);

createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RecoilRoot>
);
