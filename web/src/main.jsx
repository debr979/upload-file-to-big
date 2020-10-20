import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import UploadFile from "./component/UploadFile";
import MultipleUpload from "./component/MultipleUpload"

ReactDOM.render(
  <React.StrictMode>
    <UploadFile />
    <hr />
    <MultipleUpload/>
  </React.StrictMode>,
  document.getElementById("root"),
);
