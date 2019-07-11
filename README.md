**此文件為哈哈姆特bot package**  
-----------------
使用**npm install --save hahamute**安裝

const hahamute = require('hahamute');  
const PORT = process.env.PORT || 3000;  

**//創建實例**  
const Hahamute = hahamute({  
    AccessToken:'Your AccessToken',  
    AppSecret:'Your AppSecret'  
});  

**//使用express架設**  
const express = require('express');  
const app = express();  
const HahamuteParser = Hahamute.parser();  
app.post('/habot', HahamuteParser);  
app.listen(PORT);  

**//使用http架設**  
Hahamute.listen('/habot',PORT,()=>{  
    console.log('server start on port '+PORT);  
});

**//自訂圖片路徑**  
const imgpath =  __dirname + '/imgpath';  

**//監聽訊息**  
Hahamute.on('message', function (event) {  
    **//BOT傳送文字**  
    Hahamute.sendmessage(event.sender_id,event.message.text);  
    **//BOT傳送貼圖**  
    Hahamute.sendsticker(event.sender_id,'9','01');  
    **//BOT傳送圖片**   
    Hahamute.sendimg(event.sender_id,imgpath);  
});  



