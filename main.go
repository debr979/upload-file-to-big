package main

import (
	"log"
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
	/*Web page load*/
	r.GET("/main", home)
	r.POST("/fileToS3", fileUpload)
	if err := r.Run(":8082"); err != nil {
		log.Println(err)
	}
}

func home(c *gin.Context) {
	c.HTML(200, "index.html", nil)
}

func fileUpload(c *gin.Context) {
	fileName, isHave := c.GetPostForm("file_name")
	if !isHave {
		c.JSON(400, gin.H{
			"code": 400,
			"msg":  "檔案名稱發生錯誤",
			"info":nil,
		})
		return
	}
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{
			"code": 400,
			"msg":  "上傳檔案發生錯誤",
			"info":nil,
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
			"info":nil,
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
