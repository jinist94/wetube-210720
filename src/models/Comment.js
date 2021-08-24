import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text : {type: String, required: true},
    createdAt : {type:Date, required: true, default: Date.now},
})