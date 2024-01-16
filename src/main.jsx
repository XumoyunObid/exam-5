import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

//Store
import { Provider } from "react-redux";
import store from "./Store";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "./index.css";

//Router
import { BrowserRouter } from "react-router-dom";

// Constants
import { localTokenKey, reqTokenHederKey } from "./constants";

// Axios
import axios from "axios";
import { ToastContainer } from "react-toastify";

axios.defaults.baseURL = "https://nt-shopping-list.onrender.com/api";
axios.defaults.headers.common[reqTokenHederKey] =
  localStorage.getItem(localTokenKey);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
        <ToastContainer position="top-right" theme="colored" />
    </React.StrictMode>
);
