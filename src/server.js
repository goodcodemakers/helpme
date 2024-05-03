const express = require('express');
const app = express();
const ejs = require("ejs");
const fs = require("fs"); 
const path = require("path"); 

const PORT = 3080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "src"))); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    const readFile = fs.readFileSync(path.join(__dirname, "main.json"), "utf-8");
    const jsonData = JSON.parse(readFile);

    const listArr = Array.isArray(jsonData.items) ? jsonData.items : [];

    res.render("index.ejs", { listArr: listArr })
});


app.post("/save", (req, res) => {
    const host = req.headers.host;
    const itemName = req.body.itemName;
    const quantity = req.body.quantity;
    const memo = req.body.memo;


    fetch(`http://localhost:${PORT}/addItem`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            itemName: itemName,
            quantity: quantity,
            memo: memo
        }),
    })
    .then(response => response.json())
    .catch((error) => console.error('Error:', error));
    res.redirect(host)
  });

// post로 변경했어요 :D
app.post("/addItem", (req, res) => {
    const readFile = fs.readFileSync(path.join(__dirname, "main.json"), "utf-8");
    const jsonData = JSON.parse(readFile);
    const listArr = jsonData.items || [];

    const data = req.body;

    try {

        listArr.push(data);
    } catch (error) {
        return res.status(400).send(`{"상태":"나쁨","이유":"올바르지 않는 입력"}`);
    }

    jsonData.items = listArr;
    fs.writeFileSync(path.join(__dirname, "main.json"), JSON.stringify(jsonData));

    res.json(jsonData.items);
});

// 품목 수량 수정 엔드포인트
app.put("/updateQuantity/:id", (req, res) => {
    const itemId = req.params.id;
    const newQuantity = req.body.quantity;

    const readFile = fs.readFileSync(path.join(__dirname, "main.json"), "utf-8");
    const jsonData = JSON.parse(readFile);
    const listArr = jsonData.items || [];

    const itemToUpdate = listArr.find(item => item.id === itemId);
    if (!itemToUpdate) {
        return res.status(404).json({ error: "품목을 찾을 수 없습니다." });
    }

    itemToUpdate.quantity = newQuantity;

    fs.writeFileSync(path.join(__dirname, "main.json"), JSON.stringify(jsonData));

    res.json({ quantity: newQuantity });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server start error:', err);
    process.exit(1);
});