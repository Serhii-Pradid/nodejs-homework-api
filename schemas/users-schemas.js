import Joi from "joi";

import { emailRegexp } from "../constans/user-constans.js";

const userRegisterSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(3).required(),
})

const userLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(3).required(),
})

export default {
    userRegisterSchema,
    userLoginSchema
}