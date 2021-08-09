import User from "../models/User";
import bcrypt from "bcrypt";

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
        client_id:"893b664abf83f2c71af0",
        allow_signup:false,
        scope : "read:user user:email" //should be saperated by space  
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl)
}
export const finishGithubLogin = (req, res) => {

}

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
}
export const postEdit = async (req, res) => {
    const {
        session : {
         user : { _id },
         },
        body: {name, email, username, location} } = req; // id = req.session.user.id;
    const exists = await User.exists({$or: [{ username }, { email }]});
    if(exists){
        return res.status(400).render("edit-profile", {
            pageTitle: "Edit Profile", errorMessage : "This username/email is already taken."
        });
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        name,
        email,
        username,
        location
    }, {new:true});
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
}
export const remove = (req, res) => res.send("remove User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");