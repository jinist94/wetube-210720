import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/webtube",{
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useFindAndModify : false
});

const db = mongoose.connection;

const handleOpen = () => {
    console.log("✅connectied to DB")
}
db.on("error", (error) => console.log("❌DB error", error));
db.once("open", handleOpen);