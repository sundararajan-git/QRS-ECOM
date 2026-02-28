import { validationResult } from "express-validator"
import { AppError } from "../utils/AppError.js"


export const validate = (req, _res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const messages = errors.array().map((e) => e.msg)
        const err = new AppError(messages[0], 422)
        err.errors = messages
        return next(err)
    }
    next()
}
