// server.js

const express = require('express');
const app = express();
const ejs = require("ejs");
const fs = require("fs"); 
const path = require("path"); 

// PORT
const PORT = 3001;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// express Post
// 정적 파일을 제공할 때 올바른 경로를 설정
app.use(express.static(path.join(__dirname, "src"))); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// main.json 파일 읽기
const readFile = fs.readFileSync(path.join(__dirname, "main.json"), "utf-8"); 
const jsonData = JSON.parse(readFile);
const listArr = jsonData.items ||[]; 

app.get("/", function(req, res){
    res.render("index", { listArr }); 
});

// addItem 엔드포인트 추가
app.post("/addItem", (req, res) => {
    const { itemName, quantity, memo } = req.body;
    
    // 새로운 재고 항목 생성
    const newItem = {
        itemName,
        quantity,
        memo
    };

    // main.json에 새로운 재고 항목 추가
    listArr.push(newItem);
    jsonData.items = listArr;
    fs.writeFileSync(path.join(__dirname, "main.json"), JSON.stringify(jsonData));

    // 클라이언트에 응답 전송
    res.json(jsonData.items);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server start error:', err);
    process.exit(1); // 에러가 발생하면 서버를 종료합니다.
});
