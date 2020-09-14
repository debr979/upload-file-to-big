import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import UploadFile from "./component/UploadFile";

ReactDOM.render(
  <React.StrictMode>
    <UploadFile />
  </React.StrictMode>,
  document.getElementById("root"),
);
