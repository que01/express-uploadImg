require('es6-promise').polyfill();
var express = require('express');
var router = express.Router();
var multer  = require('multer');
var uuid = require("uuid");
var XML = require('xml');
var FaceValueModel = require('../conf/faceValue-model');
require('isomorphic-fetch');

var host = require('../conf/config')['imgHost']

var fileInfo = {
    file:null,
    setfile:function (id) {
        this.file = id
    }
};

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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        var tmpUuid = uuid.v4();
        var ext = '.'+ file.mimetype.match(/image\/(\w+)/)[1];
        fileInfo.setfile(host+'images/' + tmpUuid + ext);
        cb(null, tmpUuid  + ext)
    }
});


var upload = multer({ dest: 'public/images/',storage: storage})


/* GET faceValue listing. */
router.post('/',upload.single('file'), function(req, res, next) {

    let xml = XML([
        {PicUrl: { _cdata: fileInfo.file}},
        {MsgType: { _cdata: 'image' }}
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
                imgUrl:fileInfo.file,
                faceValue : data.match(/颜值：(.*)分/)[1],
                age : data.match(/年龄：(\w+)岁/)[1],
                pingyu : data.match(/评价：(.*)\n/)[1],
                sex : data.match(/性别：(.*)\n/)[1],
                moreThan : data.match(/全国(.*)%的/)[1]
            };
            updateOrCreate(
                FaceValueModel, {uuid:req.body.userId}, data,
                function () {
                    console.log('created');
                },
                function () {
                    console.log('updated');
                },
                function (err) {
                    console.log(err);
                });
            res.json({
                code:200,
                data:data
            })
        }catch(e){
            data = {
                uuid:req.body.userId,
                imgUrl : fileInfo.file,
                faceValue : 0,
                age : 0,
                sex : '二师兄',
                moreThan : 0,
                pingyu : '咦？二师兄你的脸呢？'
            };

            updateOrCreate(
                FaceValueModel, {uuid:req.body.userId}, data,
                function () {
                    console.log('created');
                },
                function () {
                    console.log('updated');
                },
                function (err) {
                    console.log(err);
                });

            res.json({
                code:200,
                data:data
            })
        }
    })
});

module.exports = router;
