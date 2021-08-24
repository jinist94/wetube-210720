import mongoose from "mongoose";



const videoSchema = mongoose.Schema({
    fileUrl: {type: String, required:true},
    title: {type:String, required:true, trim:true, maxLength:80 },
    description : {type:String, required:true, trim:true, maxLength: 20},
    createdAt : {type:Date, required: true, default: Date.now},
    hashtags : [{ type: String, trim:true}],
    meta : {
        views : { type:Number, default:0 , required: true },
        rating : { type:Number, default:0 , required: true },
    },
    owner : {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
})

videoSchema.static('formatHashtags', function(hashtags){
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
})

const Video = mongoose.model("Video", videoSchema);

export default Video;
