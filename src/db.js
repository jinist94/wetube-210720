import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useFindAndModify : false.valueOf,
    useCreateIndex : true,
});

const db = mongoose.connection;

const handleOpen = () => {
    console.log("✅connectied to DB")
}
db.on("error", (error) => console.log("❌DB error", error));
db.once("open", handleOpen);