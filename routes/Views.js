const express = require('express');
const router = express.Router();


router.route('/')
.get(async(req,res,next)=>{
    res.render('tutorials')
})


router.route('/admin')
.get(async(req,res,next)=>{
    res.render('signin')
});

router.route('/createAdmin')
.get(async(req,res,next)=>{
    res.render('createAdmin');
});


module.exports = router;