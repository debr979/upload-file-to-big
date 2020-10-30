import React, {useState, useEffect} from "react";

const View = () => {
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState("");
    const [isEnable, setIsEnable] = useState(false);
    const [URL, setURL] = useState("");
    const [uploadID, setUploadID] = useState("");

    const fileUpload = () => {
        setIsProcessing(true);
        setIsEnable(true);
        let formData = new FormData();
        formData.append("file_name", file.file_name);
        formData.append("file", file.file);
        let xhr = new XMLHttpRequest();

        xhr.open("POST", "/fileToS3", true);
        xhr.onload = () => {
            if (xhr.readyState === 4) {
                let data = JSON.parse(xhr.responseText);
                setResult(data.msg);
                setIsEnable(false);
                setIsProcessing(false);
                setURL(data.info.url);
                setUploadID(data.info.upload_id);

            }
        };
        xhr.send(formData);
    };

    return (
        <div className={"container"}>
            <h3>一、S3 檔案上傳</h3>
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
                <div className="col-3">
                    <input
                        className="btn btn-primary"
                        value={"上傳"}
                        type="button"
                        disabled={isEnable}
                        onClick={fileUpload}
                    />
                </div>
            </div>
            <p>
                {isProcessing ? "上傳中..." : false}
            </p>
            {result !== ""
                ? <div className={"card"}>
                    <div className="card-header">上傳結果</div>
                    <div className="card-body">
                        <a href={URL}>{URL}</a>
                    </div>
                </div>
                : ""}
        </div>
    );
};

export default View;
