package models

/* 
FileUploadRequest ...
檔案上傳models
*/
type FileUploadRequest struct {
	FileName string `json:"file_name" form:"file_name" binding:"required"`
}


