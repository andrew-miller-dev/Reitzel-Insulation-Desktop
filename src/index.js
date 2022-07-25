import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";
import { Provider } from "react-redux";
import estimateStore from "./redux/estimateStore";

ReactDOM.render(
  <Provider store={estimateStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);