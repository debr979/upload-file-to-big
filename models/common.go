package models

type Setting struct {
	AccessKeyID string `json:"access_key_id"`
	SecretKey   string `json:"secret_key"`
	Region      string `json:"region"`
	Bucket      string `json:"bucket"`
}



type Info struct {
    URL      string `json:"url"`
    UploadID string `json:"upload_id"`
}