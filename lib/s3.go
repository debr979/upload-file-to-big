package lib

import (
    "bytes"
    "encoding/json"
    "io/ioutil"
    "log"
    "mime/multipart"
    "net/http"
    "os"

    "github.com/aws/aws-sdk-go/aws"
    "github.com/aws/aws-sdk-go/aws/credentials"
    "github.com/aws/aws-sdk-go/aws/session"
    "github.com/aws/aws-sdk-go/service/s3/s3manager"
)

/*
S3Model ...
定義s3 存取key格式
*/
type s3Model struct {
    S3Region      string `json:"AWSRegion"`
    S3Bucket      string `json:"AWSBucket"`
    S3AccessKeyID string `json:"AWSAccessKeyId"`
    S3SecretKey   string `json:"AWSSecretKey"`
}

var S3Main s3Model

func (s *s3Model) SetS3Setting() {
    var s3model s3Model
    jsonFile, err := os.Open("config/setting.json")
    if err != nil {
        log.Println(err)
    }

    defer func() {
        if err := jsonFile.Close(); err != nil {
            log.Println(err)
        }
    }()

    value, err := ioutil.ReadAll(jsonFile)
    if err != nil {
        log.Println(err)
    }

    if err := json.Unmarshal(value, &s3model); err != nil {
        log.Println(err)
    }

    s.S3AccessKeyID = s3model.S3AccessKeyID
    s.S3SecretKey = s3model.S3SecretKey
    s.S3Bucket = s3model.S3Bucket
    s.S3Region = s3model.S3Region
}

/*
AddFileToS3 ...
*/
func (s *s3Model) AddFileToS3(imageFileHeader *multipart.FileHeader, filePath string) error {
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
        Region:      aws.String(s.S3Region),
        Credentials: credentials.NewStaticCredentials(s.S3AccessKeyID, s.S3SecretKey, "")},
    )

    uploader := s3manager.NewUploader(sess)

    _, err = uploader.Upload(&s3manager.UploadInput{
        Bucket:      aws.String(s.S3Bucket),
        Key:         aws.String(filePath),
        ACL:         aws.String("public-read"),
        Body:        fileBytes,
        ContentType: aws.String(contentType),
    })

    if err != nil {
        log.Printf("Unable to upload %q to %q, %v", filePath, s.S3Bucket, err)
        return err
    }

    return nil
}

func (s *s3Model) Test() {
    log.Println(s.S3AccessKeyID)
}
