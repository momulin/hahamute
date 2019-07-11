const fs = require('fs');

class message{
    constructor(option){
    this.recipient = {};
    this.recipient.id = option.id;
    
    this.message = {};
    this.message.type=option.type;
    switch(option.type){
        case 'text':
        this.message.text = option.text
        this
        break;
        case 'sticker':
        this.message.sticker_group=option.s_group;
        this.message.sticker_id=option.s_id;
        break;
        case 'img':
        this.recipient = JSON.stringify(this.recipient);
        this.message = JSON.stringify(this.message);
        this.filedata = fs.createReadStream(option.imgpath);
        break;
    }
    }
}

module.exports = message;