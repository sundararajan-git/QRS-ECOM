import asyncHandler from "express-async-handler"
import userService from "./user.service.js"

const getProfile = asyncHandler(async (req, res) => {
    const result = await userService.getProfile(req.userId)
    return res.status(result.statusCode).json(result.payload)
})

const updateProfile = asyncHandler(async (req, res) => {
    const result = await userService.updateProfile(req.userId, req.body)
    return res.status(result.statusCode).json(result.payload)
})

const deleteProfile = asyncHandler(async (req, res) => {
    const result = await userService.deleteProfile(req.userId)
    return res.status(result.statusCode).json(result.payload)
})

const userController = {
    getProfile,
    updateProfile,
    deleteProfile,
}

export default userController
