require('es6-promise').polyfill();
var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var FaceValueModel = require('../conf/faceValue-model');
var RenpinValueModel = require('../conf/renpin-model');
require('isomorphic-fetch');

/* GET faceValue listing. */
router.post('/',multipartMiddleware,function(req, res, next) {
    if(req.body.type=='faceValue'){
        FaceValueModel
            .findOne({where:{uuid:req.body.userId}})
            .then(function (results) {
                let data = results?{
                    age:results.dataValues.age,
                    pingyu:results.dataValues.pingyu,
                    sex:results.dataValues.sex,
                    faceValue:results.dataValues.faceValue,
                    moreThan:results.dataValues.moreThan,
                    imgUrl:results.dataValues.imgUrl
                }:{};
                res.json({
                    code:results?200:400,
                    data:data
                })
            })
    }else if(req.body.type=='renpin'){
        RenpinValueModel
            .findOne({where:{uuid:req.body.userId}})
            .then(function (results) {
                let data = results?results.dataValues:{};
                res.json({
                    code:results?200:400,
                    data:data
                })
            })
    }

});

module.exports = router;
