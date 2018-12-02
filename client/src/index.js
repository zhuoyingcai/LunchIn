import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "typeface-roboto";
import AOS from "aos";
import "../node_modules/aos/dist/aos.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

AOS.init();

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
