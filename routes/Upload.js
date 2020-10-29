const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(null, `${genString(10)}`+ path.extname(file.originalname));
      },
})

const upload = multer({ storage });


router.post("/", upload.single("file"), (req, res) => {
  const refreshCookie = req.headers.cookie;
  if(refreshCookie){
      const refreshToken = extractToken(refreshCookie, "=");
      jwt.verify(
          refreshToken[1],
          process.env.JWT_REFRESH_SECRET,
          async (err, authData) => {
              res.json({
                success:true,
                path: `/${req.file.path}`,
             });
          })
  }



});


router.post("/path", upload.single("file"), async(req, res) => {
  const refreshCookie = req.headers.cookie;
  if(refreshCookie){
      const refreshToken = extractToken(refreshCookie, "=");
      jwt.verify(
          refreshToken[1],
          process.env.JWT_REFRESH_SECRET,
          async (err, authData) => {
            await unlinkAsync(`.`+req.body.path);
            res.json({
              success: true,
              message: "file deleted",
            });
          })
        }
});


const genString=(length)=>{
  var result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


const extractToken = (str, splitAt) => {
  let token = str.split(splitAt);
  return token;
};

module.exports = router;