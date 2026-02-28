import { AppError } from "../../utils/AppError.js"
import { sanitize } from "../../utils/helperFunctions.js"
import userRepository from "./user.repository.js"

const sanitizeUser = (user) =>
    sanitize(user, ["_id", "email", "username", "profilePic", "isVerified", "isLogin", "updatedAt", "roles"])

const getProfile = async (userId) => {
    const user = await userRepository.findById(userId)
    if (!user) {
        throw new AppError("User not found", 404)
    }

    return {
        statusCode: 200,
        payload: {
            status: "FETCHED",
            user: sanitizeUser(user),
        },
    }
}

const updateProfile = async (userId, body) => {
    const { username, profilePic } = body
    const payload = {}

    if (typeof username === "string") {
        payload.username = username.trim()
    }

    if (typeof profilePic === "string") {
        payload.profilePic = profilePic.trim()
    }

    if (Object.keys(payload).length === 0) {
        throw new AppError("At least one field is required", 400)
    }

    const user = await userRepository.updateById(userId, payload)
    if (!user) {
        throw new AppError("User not found", 404)
    }

    return {
        statusCode: 200,
        payload: {
            status: "UPDATED",
            user: sanitizeUser(user),
        },
    }
}

const deleteProfile = async (userId) => {
    const user = await userRepository.deleteById(userId)
    if (!user) {
        throw new AppError("User not found", 404)
    }

    return {
        statusCode: 200,
        payload: {
            status: "DELETED",
            message: "User deleted successfully",
        },
    }
}

const userService = {
    getProfile,
    updateProfile,
    deleteProfile,
}

export default userService
