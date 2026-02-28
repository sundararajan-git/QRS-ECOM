import jwt from "jsonwebtoken"
import { AppError } from "../utils/AppError.js"
import User from "../modules/user/user.model.js"

export const validUser = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("No token provided", 401)
        }

        const token = authHeader.split(" ")[1]
        if (!token) {
            throw new AppError("No token provided", 401)
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new AppError("JWT secret is not configured", 500)
        }

        const decoded = jwt.verify(token, secret)
        if (!decoded?.userId) {
            throw new AppError("Invalid token", 401)
        }

        req.userId = decoded.userId
        next()
    } catch (error) {
        next(error)
    }
}


export const isAdmin = async (req, _res, next) => {
    try {
        const user = await User.findById(req.userId).select("roles")
        if (!user) {
            throw new AppError("User not found", 404)
        }

        if (!Array.isArray(user.roles) || !user.roles.includes("admin")) {
            throw new AppError("Admin access required", 403)
        }

        next()
    } catch (error) {
        next(error)
    }
}
