import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4000;

const handleListener = () => console.log(`✅Server Listening on ${PORT}❗️`);
app.listen(PORT, handleListener);
