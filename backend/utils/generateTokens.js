import jwt from "jsonwebtoken"
import crypto from "crypto"
import { AppError } from "./AppError.js"

export const generateJwtToken = async (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new AppError("JWT_SECRET is not configured", 500)
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

export const verificationToken = () =>
    Math.floor(100000 + Math.random() * 900000).toString()

export const resetPasswordToken = () =>
    crypto.randomBytes(32).toString("hex")
