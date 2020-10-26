package main

import (
	"io/ioutil"
	"log"
	"os"
	"upload-file-for-big/lib"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()

	/*Static file load*/
	r.Static(`/_assets`, `./web/dist/_assets/`)
	/*Html file load*/
	r.LoadHTMLGlob("./web/dist/*.html")

	r.GET("/checkFile", checkFile)

	/*Web page load*/
	r.GET("/main", home)

	r.POST("/fileToS3", fileUpload)
	r.POST("/uploadPool", uploadPoolFile)
	r.POST("/multiFile", multifileUpload)
	if err := r.Run(":8082"); err != nil {
		log.Println(err)
	}
}

func home(c *gin.Context) {
	c.HTML(200, "index.html", nil)
}

func uploadPoolFile(c *gin.Context) {
	dir := "./file-pool/"

	files, _ := ioutil.ReadDir(dir)
	if len(files) <= 0 {
		c.JSON(400, gin.H{
			"code": 400,
			"msg":  "資料夾裡無任何檔案",
			"info": nil,
		})
		return
	}

	type doneJobs struct {
		Count int      `json:"count"`
		URLS  []string `json:"urls"`
	}

	var dj doneJobs
	s3 := lib.S3Main
	s3.SetS3Setting()
	for _, file := range files {
		// readFile, _ := ioutil.ReadFile(dir + file.Name())
		// reader := bytes.NewReader(readFile)
		f, _ := os.Open(dir + file.Name())
		result, _ := s3.AddLocalFileToS3(f, file.Name())
		dj.URLS = append(dj.URLS, result.URL)
		dj.Count++
		log.Printf("完成: %s ...", file.Name())
	}

	c.JSON(200, gin.H{
		"code": 200,
		"msg":  "上傳成功",
		"info": dj,
	})

}

func checkFile(c *gin.Context) {
	files, _ := ioutil.ReadDir("./file-pool")
	if len(files) <= 0 {
		c.JSON(400, gin.H{
			"code": 400,
			"msg":  "資料夾裡無任何檔案",
			"info": nil,
		})
		return
	}

	var fileArr []string
	for _, file := range files {
		fileArr = append(fileArr, file.Name())
	}

	var result struct {
		FileName []string `json:"file_name"`
	}
	result.FileName = fileArr
	c.JSON(200, gin.H{
		"code": 200,
		"msg":  "讀取完成",
		"info": result,
	})
}

func fileUpload(c *gin.Context) {
	fileName, isHave := c.GetPostForm("file_name")
	if !isHave {
		c.JSON(400, gin.H{
			"code": 400,
			"msg":  "檔案名稱發生錯誤",
			"info": nil,
		})
		return
	}
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{
			"code": 400,
			"msg":  "上傳檔案發生錯誤",
			"info": nil,
		})
		return
	}

	s3 := lib.S3Main
	s3.SetS3Setting()
	var result lib.Info
	result, err = s3.AddFileToS3(file, "/"+file.Filename)
	if err != nil {
		c.JSON(400, gin.H{
			"code": 400,
			"msg":  "缺少S3設定檔或權限不足",
			"info": nil,
		})
		return
	}

	c.JSON(200, gin.H{
		"code": 200,
		"msg":  fileName + " 上傳成功",
		"info": result,
	})

	return
}

func multifileUpload(c *gin.Context) {
	multiFile, err := c.MultipartForm()
	if err != nil {
		c.JSON(400, gin.H{
			"code": 400,
			"msg":  err.Error(),
			"info": nil,
		})
		return
	}

    s3 := lib.S3Main
	s3.SetS3Setting()
	files := multiFile.File["files"]
	for _, file := range files {
		log.Println(file.Filename)
	}

}
