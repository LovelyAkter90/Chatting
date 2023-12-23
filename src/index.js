import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import firebaseConfig from "./Dbconnection/firebaseConfig";
import "react-toastify/dist/ReactToastify.css";

import { Provider } from "react-redux";
import store from "./features/Store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
