import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import { async } from "regenerator-runtime";


export const home = async(req, res) => {
    
    const videos = await Video.find({}).sort({createdAt : "desc"});
    console.log(videos.meta)
    return res.render("home", {pageTitle: "Home", videos});
}

export const watch = async(req, res) => {
    const { id } = req.params; // id = req.params.id 랑 같음
    const video = await Video.findById(id).populate("owner").populate("comments");
    if(video){
        return res.render("watch", {pageTitle: video.title, video });
        
    }
    return res.status(404).render("404", {pageTitle: "Video not found." });
}

export const getEdit = async (req, res) => {
    const { id } = req.params; // id = req.params.id 랑 같음
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    console.log(video.owner, _id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found." });
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle: `Edit :${video.title} `, video});
}

export const postEdit = async(req, res) => {
    const { id } = req.params;
    const {user: {_id}} = req.session;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({_id : id});
    if(!video){
        return res.render("404", {pageTitle: "Video not found." });
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title, description, 
        hashtags: Video.formatHashtags(hashtags),
    })
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) =>{
    return res.render("upload", {pageTitle: "Upload Video"});
}
export const postUpload = async(req, res) => {
    const {user : {_id}} = req.session;
    const {location} = req.file;
    const { title, description, hashtags } = req.body;
    console.log(req.file);
    try{
        const newVideo = await Video.create({
            fileUrl: location,
            title,
            owner : _id,
            description,
            hashtags: Video.formatHashtags(hashtags),
        })
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch(error) {
        return res.status(400).render("upload", {pageTitle: "Upload Video", errorMessage : error._message});
    }
    
}

export const deleteVideo = async(req, res) =>{
    const { id } = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.render("404", {pageTitle: "Video not found." });
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id)
    // delete video
    return res.redirect("/")
}

export const search = async(req, res) =>{
    const {keyword} = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({
            title : {
                $regex: new RegExp(keyword, "i")
            },
        })
    }
    return res.render("search", {pageTitle: "Search", videos});
} 

export const registerView = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}

export const createComment = async(req, res) => {
    const {
        params : {id},
        body : {text},
        session : {user},
    } = req;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner : user._id,
        video : id,
    });
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({ newCommentId:comment._id});
}

export const deleteComment = async(req, res) =>{
    const {
        params : {id},
        body : {text},
        session : {user},
    } = req;
    const comment = await Comment.findById(id).populate("owner").populate("video");
    const videoId = comment.video._id
    const video = await Video.findById(videoId);

    if(!comment){
        return res.sendStatus(404);
    }
    if(String(user._id) === String(comment.owner._id)){
        video.comments.splice(video.comments.indexOf(id), 1);
        video.save();
        Comment.findByIdAndRemove(id);
        return res.sendStatus(200);
    }
    return res.sendStatus(404);
   

}