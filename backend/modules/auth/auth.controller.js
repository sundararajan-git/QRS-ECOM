import asyncHandler from "express-async-handler"
import authService from "./auth.service.js"

const signup = asyncHandler(async (req, res) => {
    const result = await authService.signup(req.body)
    return res.status(result.statusCode).json(result.payload)
})

const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body)
    return res.status(result.statusCode).json(result.payload)
})

const verifyEmail = asyncHandler(async (req, res) => {
    const result = await authService.verifyEmail(req.params.id, req.body)
    return res.status(result.statusCode).json(result.payload)
})

const forgotPassword = asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(req.body)
    return res.status(result.statusCode).json(result.payload)
})

const resetPassword = asyncHandler(async (req, res) => {
    const result = await authService.resetPassword(req.params.token, req.body)
    return res.status(result.statusCode).json(result.payload)
})

const logout = asyncHandler(async (req, res) => {
    const result = await authService.logout(req.userId)
    return res.status(result.statusCode).json(result.payload)
})

const getUser = asyncHandler(async (req, res) => {
    const result = await authService.getUser(req.userId)
    return res.status(result.statusCode).json(result.payload)
})

const authController = {
    signup,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    getUser,
}

export default authController
