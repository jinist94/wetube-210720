import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    //console.log(req.session);
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next();
    }else{
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware = (req, res, next) =>{
    if(!req.session.loggedIn){
        return next();
    } else{
        return res.redirect("/");
    }
}

export const uploadAvatar = multer({ dest: "uploads/avatars/", limits:{
    fileSize: 300000,
},
});
export const uploadVideo = multer({ dest: "uploads/videos/", limits:{
    fileSize: 10000000,
},
});