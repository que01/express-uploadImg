require('es6-promise').polyfill();
var express = require('express');
var router = express.Router();
var XML = require('xml');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var FaceValueModel = require('../conf/faceValue-model');
require('isomorphic-fetch');

/* GET faceValue listing. */
router.post('/',multipartMiddleware,function(req, res, next) {
    let xml = XML([
        {Content: { _cdata: '人品'+req.body.name}},
        {MsgType: { _cdata: 'text' }}
    ]);
    xml = '<xml>' + xml + '</xml>';

    fetch('http://www.ehangnet.com/wechat/xiaoming.php', {
        method: 'POST',
        body:xml,
        headers: {
            'Content-Type': 'text/xml'
        }
    }).then((response) => {
        return response.text()
    }).then((data)=>{
        console.log(data)
        try{
            data = {
                name : data.match(/姓名：(.*)/)[1],
                renpin : data.match(/人品：(\w+)分/)[1],
                pingyu : data.match(/评价：(.*)\n/)[1],
            };
            res.json({
                code:200,
                data:data
            })
        }catch(e){}
    })
});

module.exports = router;
