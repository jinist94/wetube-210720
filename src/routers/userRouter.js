import express from "express";
import {edit, remove, logout, see, startGithubLogin, finishGithubLogin, getEdit, postEdit, getChangePassword, postChangePassword } from "../controllers/userController"
import { protectorMiddleware, publicOnlyMiddleware, uploadFiles } from "../middlewares";

const userRouter = express.Router();


userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(uploadFiles.single("avatar"), postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id(\\d+)", see);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);

export default userRouter;