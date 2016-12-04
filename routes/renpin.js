require('es6-promise').polyfill();
var express = require('express');
var router = express.Router();
var XML = require('xml');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var RenpinValueModel = require('../conf/renpin-model');
require('isomorphic-fetch');

var updateOrCreate = function (model, where, newItem, onCreate, onUpdate, onError) {
    // First try to find the record
    model.findOne({where: where}).then(function (foundItem) {
        if (!foundItem) {
            // Item not found, create a new one
            model.create(newItem)
                .then(function () {
                    onCreate();
                })
                .error(function (err) {
                    onError(err);
                });
        } else {
            // Found an item, update it
            model.update(newItem, {where: where})
                .then(function () {
                    onUpdate();
                })
                .catch(function (err) {
                    onError(err);
                });
            ;
        }
    }).catch(function (err) {
        onError(err);
    });
}


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
        try{
            data = {
                uuid: req.body.userId,
                name : data.match(/姓名：(.*)/)[1],
                renpin : data.match(/人品：(\w+)分/)[1],
                pingyu : data.match(/评价：(.*)\n/)[1],
            };
            updateOrCreate(
                RenpinValueModel, {uuid:req.body.userId}, data,
                function () {
                    res.json({
                        code:200,
                        data:data
                    })
                },
                function () {
                    res.json({
                        code:200,
                        data:data
                    })
                },
                function (err) {
                    res.json({
                        code:500,
                        msg: 'mysql connection is error!'
                    })
                });

        }catch(e){}
    })
});

module.exports = router;
