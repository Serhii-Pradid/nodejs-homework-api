import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import fs from "fs/promises";

import path from "path";

import User from "../models/user.js";

import {ctrlWrapper} from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

import { request } from "express";

import gravatar from "gravatar";

import Jimp from "jimp";

const {JWT_SECRET} = process.env;

const avatarPath = path.resolve("public", "avatars");

const register = async(req, res) => {
    const {email, password } = req.body;
    const avatarURL = gravatar.url(email);
    const user = await User.findOne({email});
    
      if(user) {
      throw HttpError(409, "Email in use")
   }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, avatarURL, password: hashPassword});

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    })
}

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError (401, "Email or password is wrong")
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError (401, "Email or password is wrong")  
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});

    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
            avatarURL:user.avatarURL,
    }
         })
}

const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    })
}

const logout = async(req, res) => {
    const{_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "No Content"
    })
}

const updateAvatar = async(req, res) => {
    const {_id} = req.user;
    const {path: oldPath, filename} = req.file;
    await Jimp.read(oldPath).then((img) =>
    img.resize(250, 250).write(`${oldPath}`)
  );
    const fileName =`${_id}_${filename}`;
    const newPath = path.join(avatarPath, fileName);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", fileName);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({
        avatarURL,
    })
}

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar:ctrlWrapper(updateAvatar),
    }