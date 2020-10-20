快速部署：  
   1、 在專案目錄下使用命令列工具 輸入: . ./run.sh  
   2、 在專案目錄下使用命令列工具 輸入: make build  

擇一使用即可  
   資料夾上傳請將檔案放入/file-pool資料夾中，請先刪除測試資料  

安裝NPM：  
https://www.npmjs.com/get-npm  (安裝Nodejs and npm)


1、先到/config/setting.json  輸入S3的設定

2、cd /upload-file-for-big/web  
   輸入指令  
   npm install  
   等他執行完成  
   再輸入  
   npm run build  
   等他執行完成  
   再cd ..(回上層)  
   go run main.go  
   等他執行完成。  


開啟瀏覽器  
網址：http://localhost:8082/main  
即可開始上傳



