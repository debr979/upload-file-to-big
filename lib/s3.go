package lib

import (
	"bytes"
	"log"
	"mime/multipart"
	"net/http"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

var s3Region string
var s3Bucket string
var s3AccessKeyID string
var s3SecretKey string

func init() {
	var s3Region = ""
	var s3Bucket = ""
	var s3AccessKeyID = ""
	var s3SecretKey = ""

	log.Println(s3Region, s3Bucket, s3AccessKeyID, s3SecretKey)
}

/*
AddFileToS3 ...

*/
func AddFileToS3(imageFileHeader *multipart.FileHeader, filePath string) error {
	file, err := imageFileHeader.Open()

	defer file.Close()

	if err != nil {
		return err
	}

	buffer := make([]byte, imageFileHeader.Size) // read file content to buffer
	file.Read(buffer)
	contentType := http.DetectContentType(buffer)
	fileBytes := bytes.NewReader(buffer)

	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(s3Region),
		Credentials: credentials.NewStaticCredentials(s3AccessKeyID, s3SecretKey, "")},
	)

	uploader := s3manager.NewUploader(sess)

	_, err = uploader.Upload(&s3manager.UploadInput{
		Bucket:      aws.String(s3Bucket),
		Key:         aws.String(filePath),
		ACL:         aws.String("public-read"),
		Body:        fileBytes,
		ContentType: aws.String(contentType),
	})

	if err != nil {
		log.Printf("Unable to upload %q to %q, %v", filePath, s3Bucket, err)
		return err
	}

	return nil
}
