import React, {useState} from "react";

const View = () => {
    const [fileNames, setFileNames] = useState([]);
    const [file, setFile] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState("");
    const [isEnable, setIsEnable] = useState(true);
    const [URL, setURL] = useState([]);
    const [files, setFiles] = useState({});
    const [count, setCount] = useState(0);
    const [fileLength, setFileLength] = useState(0);
    const [uploadSetting, setUploadSetting] = useState({});
    const [accessKeyID, setAccessKeyId] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [region, setRegion] = useState("");
    const [bucket, setBucket] = useState("");
    const [isLock, setIsLock] = useState(false);

    const fileUpload = () => {
        //上傳檔案
       
        let formData = new FormData();
        let settingData = {
            access_key_id:accessKeyID,
            secret_key:secretKey,
            region:region,
            bucket:bucket,
        };
        formData.append('setting', JSON.stringify(settingData));
        for(let i=0;i<= fileLength;i++){
         formData.append('files', files[i]);
        }
 
        
        setIsProcessing(true);
        setIsEnable(true);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/multiFile");
        xhr.withCredentials = true;
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
        xhr.send(formData);
    };

    const handleChangeAccessKeyID = e => {
        setAccessKeyId(e.target.value);
    };

    const handleChangeSecretKey = e => {
        setSecretKey(e.target.value);
    };

    const handleChangeRegion = e => {
        setRegion(e.target.value);
    };

    const handleChangeBucket = e => {
        setBucket(e.target.value);
    };

    const lockSetting = e => {
        if (e.target.value === '上鎖') {
            setIsLock(true);
            setIsEnable(false);
        } else {
            setIsLock(false);
        }
    };

    return (
        <div className={"container"}>
            <h3>二、S3 資料夾多檔上傳({fileLength})</h3>
            <div className="form-group row">
                <label className="col-2 col-form-label">AccessKeyID</label>
                <input className="col-4 form-control" placeholder="AccessKeyID" onChange={handleChangeAccessKeyID}
                       disabled={isLock}/>
                <label className="col-2 col-form-label">SecretKey</label>
                <input className="col-4 form-control" placeholder="SecretKey" onChange={handleChangeSecretKey}
                       disabled={isLock}/>
            </div>
            <div className="form-group row">
                <label className="col-2 col-form-label">Region</label>
                <input className="col-4 form-control" placeholder="Region" onChange={handleChangeRegion}
                       disabled={isLock}/>
                <label className="col-2 col-form-label">Bucket</label>
                <input className="col-4 form-control" placeholder="Bucket" onChange={handleChangeBucket}
                       disabled={isLock}/>
            </div>
            <div className="form-group row">
                <div className="col-6 form-group">
                    <input
                        type="file"
                        onChange={(e) => {
                            let preUpload = e.target.files;
                            setFileLength(preUpload.length);
                            console.log(preUpload)
                            setFiles(preUpload);
                        }} multiple
                    />
                </div>
                <div className="col-3">
                    <input
                        className="btn btn-warning"
                        value={isLock ? '開鎖' : '上鎖'}
                        type="button"
                        onClick={lockSetting}
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
