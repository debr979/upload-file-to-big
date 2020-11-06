import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import UploadFile from "./component/uploadFile";
import MultipleUpload from "./component/multipleUpload"

ReactDOM.render(
  <React.StrictMode>
    <UploadFile />
    <hr />
    <MultipleUpload/>
  </React.StrictMode>,
  document.getElementById("root"),
);
