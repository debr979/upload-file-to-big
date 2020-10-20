import React, {useState} from "react";

const View = () => {
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState("");
    const [isEnable, setIsEnable] = useState(true);
    const [URL, setURL] = useState([]);
    const [uploadID, setUploadID] = useState("");
    const [files, setFiles] = useState([]);
    const [count, setCount] = useState(0);

    const fileUpload = () => {
        setIsProcessing(true);
        setIsEnable(true);
        let xhr = new XMLHttpRequest();

        xhr.open("POST", "/uploadPool", true);
        xhr.onload = () => {
            if (xhr.readyState === 4) {
                let data = JSON.parse(xhr.responseText);
                setResult(data.msg);
                setIsEnable(false);
                setIsProcessing(false);
                setURL(data.info.urls);
                setCount(data.info.count);
            }
        };
        xhr.send(null);
    };

    const CheckFile = e => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "/checkFile", true);
        xhr.onload = () => {
            if (xhr.readyState === 4) {
                let data = JSON.parse(xhr.responseText);
                setIsEnable(false);
                setFiles(data.info.file_name);
            }
        };
        xhr.send(null);
    };


    return (
        <div className={"container"}>
            <h3>二、S3 資料夾多檔上傳({files.length})</h3>
            <div className="row">
                <div className="col-6">
                    {
                        files.map((item, idx) => {
                            return (
                                <div className="col-12" key={idx}>{idx + 1 + "、" + item}</div>
                            )

                        })
                    }
                </div>
                <div className="col-3">
                    <input
                        className="btn btn-warning"
                        value={"檢查"}
                        type="button"
                        onClick={
                            CheckFile
                        }
                    />
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
                        <h3>{result}</h3>
                        <h3>上傳筆數：{count}</h3>
                        {
                            URL.map((item, idx) => {
                                return (<a key={idx} href={item}>item</a>)
                            })
                        }
                    </div>
                </div>
                : ""}
        </div>
    );
};

export default View;
