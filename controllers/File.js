const File = require('../models/File');
const jwt = require('jsonwebtoken')

exports.createTutorial = (req,res,next)=>{
    const refreshCookie = req.headers.cookie;
    if(refreshCookie){
        const refreshToken = extractToken(refreshCookie, "=");
        jwt.verify(
            refreshToken[1],
            process.env.JWT_REFRESH_SECRET,
            async (err, authData) => {
                const data = await File.create(req.body);
                res.json({
                    success:true,
                    data
                });
            })
    }

}


exports.getTutorials = async(req,res,next)=>{
    const data = await File.find();
    res.json({
        success:true,
        count:data.length,
        data
    });
}


exports.getTutorial= async(req,res,next)=>{
    const data = await File.findById(req.params.id);
    res.json({
        success:true,
        data
    });
}


exports.findByTitle= async(req,res,next)=>{
    const data = await File.find();
    res.json({
        success:true,
        count:data.length,
        data
    });
}

exports.deleteTutorial= (req,res,next)=>{
    const refreshCookie = req.headers.cookie;
    if(refreshCookie){
        const refreshToken = extractToken(refreshCookie, "=");
         jwt.verify(
            refreshToken[1],
            process.env.JWT_REFRESH_SECRET,
            async (err, authData) => {
                await File.findByIdAndDelete(req.params.id);
                res.json({
                    success:true,
                    data:`Item Deleted`
                });
            })
    }

} 


const extractToken = (str, splitAt) => {
    let token = str.split(splitAt);
    return token;
  };