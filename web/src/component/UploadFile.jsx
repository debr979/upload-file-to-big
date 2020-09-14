import React, { useState, useEffect } from "react";

const View = () => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState({});
  const fileUpload = () => {
    let formData = new FormData();
    formData.append("file_name", file.file_name);
    formData.append("file", file.file);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/fileToS3");
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        let data = JSON.parse(xhr.responseText);
        alert(data.msg);
        return;
      }
    };
    xhr.send(formData);
  };
  return (
    <div className={"container"}>
      <h3>S3 檔案上傳</h3>
      <div className="row">
        <div className="col-6 ">
          <form>
            <input
              type="file"
              value={fileName}
              onChange={(e) => {
                let preUpload = e.target.value;
                setFileName(preUpload);
                let uploadFile = {
                  "file_name": e.target.files[0].name,
                  "file": e.target.files[0],
                };
                setFile(uploadFile);
              }}
            />
          </form>
        </div>
        <div className="col-6">
          <input
            className="btn btn-primary"
            value={"上傳"}
            type="button"
            onClick={fileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default View;
