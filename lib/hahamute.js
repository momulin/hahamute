const EventEmitter = require('events');
const crypto = require('crypto');
const http = require('http');
const request = require('request');
const bodyParser = require('body-parser');
const message = require('./message.js');
const fs = require('fs');

class Hahamute extends EventEmitter {
    constructor(options) {
        super();
        this.options = options || {};
        this.AppSecret = options.AppSecret || '';
        this.AccessToken = options.AccessToken || '';
        this.endpoint = 'https://us-central1-hahamut-8888.cloudfunctions.net';
    }

    sendmessage(to, text) {
        //     {
        //     "recipient":{
        //         "id":to
        //       },
        //       "message":{
        //         "type":"text",
        //         "text":text
        //     }
        // }
        this.post('/messagePush', new message({ id: to, type: 'text', text: text }));
    }

    sendsticker(to, group, id) {
        //     {
        //     "recipient":{
        //       "id":to
        //     },
        //     "message":{
        //       "type":"sticker",
        //       "sticker_group":group,
        //       "sticker_id":id
        //     }
        //     }
        this.post('/messagePush', new message({ id: to, type: 'sticker', s_group: group, s_id: id }));
    }

    sendimg(to,imgpath){   
        this.postform('/ImgMessagePush',new message({ id: to, type: 'img' ,imgpath:imgpath}));
    }

    post(path, body) {
        const headers = {
            'Content-Type': 'application/json'
        };
        const url = this.endpoint + path + '?access_token=' + this.AccessToken;
        const options = { url, body: JSON.stringify(body), headers: headers };
        return request.post(options);
    }
    postform(path,formData){
        const url = this.endpoint + path + '?access_token=' + this.AccessToken;
        
        return request.post({url:url, formData: formData});
    }

    // Optional Express.js middleware
    parser() {
        const parser = bodyParser.json({
            verify: function (req, res, buf, encoding) {
                req.rawBody = buf.toString(encoding);
            }
        });
        return (req, res) => {
            parser(req, res, () => {
                if (this.checkSignature(req.headers['x-baha-data-signature'], req.body)) {
                    return res.sendStatus(400);
                }
                this.emit('message', req.body.messaging[0]);
                return res.json({});
            });
        };
    }


    // Optional http server
    listen(path, port, callback) {
        const parser = bodyParser.json({
            verify: function (req, res, buf, encoding) {
                req.rawBody = buf.toString(encoding);
            }
        });

        const server = http.createServer((req, res) => {
            if (req.method === 'POST' && req.url === path) {

                parser(req, res, () => {
                    if (this.checkSignature(req.headers['x-baha-data-signature'], req.body)) {
                        res.statusCode = 400;
                        return res.end('Bad request');
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    this.emit('message', req.body.messaging[0])
                    return res.end('{}');
                });
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                return res.end('Not found');
            }
        });
        return server.listen(port, callback);
    }

    checkSignature(Signature, body) {
        const hmac = crypto.createHmac('sha1', this.AppSecret);
        hmac.update(JSON.stringify(body), 'utf-8');
        const expectedSignature = 'sha1=' + hmac.digest('hex');
        return Signature !== expectedSignature;
    }
}

function createBot(options) {
    return new Hahamute(options);
}

module.exports = createBot;
module.exports.Hahamute = Hahamute;
