import { Schema, model } from "mongoose";

import { handleSaveError, validateAtUpdate } from "./hooks.js";

import { emailRegexp } from "../constans/user-constans.js";

const userSchema = new Schema({

        password: {
          type: String,
          minlenth: 3,
          required: [true, 'Set password for user'],
        },
        email: {
          type: String,
          match: emailRegexp,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          //required: [true, 'Verify token is required'],
        },
        token: String,
        avatarURL: String,

      

},  {versionKey: false, timestamps: true});

userSchema.pre("findOneAndUpdate", validateAtUpdate);

userSchema.post("save", handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model( "user", userSchema );

export default User;