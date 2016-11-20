var express = require('express');
var router = express.Router();
var multer  = require('multer');
var uuid = require("uuid");

var host = require('../conf/config')['imgHost']

var fileInfo = {
    file:null,
    setfile:function (id) {
        this.file = id
    }
};

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


/* GET users listing. */
router.post('/',upload.single('file'), function(req, res, next) {
    res.json({
        code:200,
        data:{
            imgUrl:fileInfo.file
        }
  })
});

module.exports = router;
