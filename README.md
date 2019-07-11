const hahamute = require('hahamute');
const PORT = process.env.PORT || 3000;

const Hahamute = hahamute({
    AccessToken:'Your AccessToken',
    AppSecret:'Your AppSecret'
});
const imgpath =  __dirname + '/imgpath';

// Optional express
const express = require('express');
const app = express();
const HahamuteParser = Hahamute.parser();
app.post('/habot', HahamuteParser);
app.listen(PORT);

// Optional http server
Hahamute.listen('/habot',PORT,()=>{
    console.log('server start on port '+PORT);
});

// message event
Hahamute.on('message', function (event) {
    //send message
    Hahamute.sendmessage(event.sender_id,event.message.text);
    //send sticker
    Hahamute.sendsticker(event.sender_id,'9','01');
    //send img
    Hahamute.sendimg(event.sender_id,imgpath);
});



