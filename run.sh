
echo "開始安裝網頁套件..."
npm install --prefix ./web
echo "安裝完成"

echo "開始部署網頁..."
npm run build --prefix ./web
echo "部署完成"

echo "封裝專案.."

go build -o main main.go
echo "封裝完成"


echo "開始執行..."
./main