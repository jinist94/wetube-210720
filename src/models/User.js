import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email : { type: String, requered:true, unique: true},
    username : {type: String, requered:true, unique: true},
    password : {type: String, requered:true, unique: true},
    name: {type: String, requered:true, unique: true},
    location : String
})

userSchema.pre('save', async function(){
    console.log("User Password:", this.password);
    this.password = await bcrypt.hash(this.password, 5,);
    console.log("hashed password:", this.password);
})

const User = mongoose.model("User", userSchema);

export default User;