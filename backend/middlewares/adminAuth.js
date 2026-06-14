function adminAuth(req,res,next){

    if(
        req.user.role !==
        'admin'
    ){

        console.log(req.user.role)
        // return res.status(403)
        // .json({
        //     message:
        //     'Access denied brother'
        // });

        return res.send('<h1>Access Denied!</h1>');

    }

    next();

}

module.exports = adminAuth;