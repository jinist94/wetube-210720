import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => res.render("Join", {pageTitle: "Join"});
export const postJoin = async(req, res) => {
    const {name, email, username, password, password2, location} = req.body;
    const pageTitle = "Join"
    const exists = await User.exists({$or: [{ username }, { email }]});
    if(password !== password2){
        return res.status(400).render("Join", {
            pageTitle, errorMessage : "Password confirmation dose not match."
        });
    }
    if(exists){
        return res.status(400).render("Join", {
            pageTitle, errorMessage : "This username/email is already taken."
        });
    }
    try{
        await User.create({
            name, email, username, password, location,
        })
        return res.redirect("/login");
    } catch(error){
        return res.status(400).render("Join", {
            pageTitle, errorMessage : error._message
        });
    }
    
}

export const getLogin = (req, res) => res.render("Login", {pageTitle:"Login"});

export const postLogin = async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username})
    const pageTitle = "Login"
    if(!user){
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "An account with this username dose not exists.",
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "Wrong password.",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup:false,
        scope: "read:user user:email",  
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}
export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config ={
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
        method:"POST",
        headers: {
            Accept: "application/json",
        },
        })
        ).json();
    if("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const userRequest = await(
            await fetch("https://api.github.com/user", {
            headers:{
                Authorization: `token ${access_token}`,
            }
        })
        ).json();
        console.log(userRequest)
    }else {
        return res.redirect("/");
    }
}

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
}
export const postEdit = async (req, res) => {
    const {
        session : {
         user : { _id, avatarUrl, email: sessionEmail, username: sessionUsername},
         },
        body: {name, email, username, location
        },
        file,
     } = req; // id = req.session.user.id;

     let searchEdit = [];
     if(sessionEmail !== email){
        searchEdit.push({email});
     }
     if(sessionUsername !== username){
        searchEdit.push({username});
     }
     if(searchEdit.length > 0){
        const foundUser = await User.findOne({$or: searchEdit});
        if(foundUser && foundUser._id.toString() !== _id){
            return res.status(400).render("edit-profile", {
                pageTitle: "Edit Profile", errorMessage : "This username/email is already taken."
            });
        }
     }
    
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location
    }, {new:true});
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
}

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly === true){
        res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle:"Change Password"});
}
export const postChangePassword = async (req, res) => {
    const {session : {
        user: {_id, password},
    },
    body: { oldPassword, newPassword, newPasswordConfirmation},
    } = req;
    if(newPassword !== newPasswordConfirmation){
        return res.status(404).render("users/change-password", {
            pageTitle:"Change Password", 
            errorMessage:"The password dose not mach the confirmation",
        });
    }
    const ok = await bcrypt.compare(oldPassword, password);
    if(!ok){
        return res.status(404).render("users/change-password", {
            pageTitle:"Change Password", 
            errorMessage:"The current password is incorrect"
        });
    }
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;

    return res.redirect("/user/logout");
}
export const remove = (req, res) => res.send("remove User");
export const logout = (req, res) => res.send("Logout");
export const see = async(req, res) => {
    const {id } = req.params;
    const user = await User.findById(id);
    if(!user){
        return res.status(404).render("404", {pageTitle: "User not found."});
    }
    return res.render("users/profile", {pageTitle: user.name, user});
}