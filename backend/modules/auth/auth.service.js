import bcrypt from "bcryptjs"
import { AppError } from "../../utils/AppError.js"
import { generateJwtToken, resetPasswordToken, verificationToken } from "../../utils/generateTokens.js"
import { sanitize } from "../../utils/helperFunctions.js"
import MailService from "../../utils/sendMailHandler.js"
import authRepository from "./auth.repository.js"

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

const sanitizeUser = (user) =>
    sanitize(user, ["_id", "email", "username", "profilePic", "isVerified", "isLogin", "updatedAt", "roles"])

const assertStrongPassword = (password) => {
    if (!PASSWORD_REGEX.test(password)) {
        throw new AppError("Password does not meet the requirements", 400)
    }
}

const signup = async (body) => {
    const { email, password, software = "QRS Ecom" } = body

    if (!email?.trim() || !password?.trim()) {
        throw new AppError("Email and password are required", 400)
    }
    const normalizedEmail = email.trim().toLowerCase()
    assertStrongPassword(password)

    const existingUser = await authRepository.findByEmail(normalizedEmail)
    if (existingUser) {
        if (existingUser.isVerified) {
            return {
                statusCode: 400,
                payload: {
                    message: "User already exists, please login",
                    status: "ALREADY_VERIFIED",
                    user: sanitizeUser(existingUser),
                },
            }
        }

        if (existingUser.verificationExpireAt && existingUser.verificationExpireAt >= Date.now()) {
            await MailService.sendVerificationMail(
                existingUser.email,
                "Verify Your Email",
                existingUser.verificationToken,
                software
            )
            return {
                statusCode: 200,
                payload: {
                    message: "Verification email resent",
                    status: "RESEND_VERIFICATION",
                    user: sanitizeUser(existingUser),
                },
            }
        }

        await authRepository.deleteById(existingUser._id)
    }

    const user = await authRepository.create({
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        verificationToken: verificationToken(),
        verificationExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    })

    await MailService.sendVerificationMail(user.email, "Verify Your Email", user.verificationToken, software)

    return {
        statusCode: 201,
        payload: {
            message: "User created successfully",
            status: "NEW_USER",
            user: sanitizeUser(user),
        },
    }
}

const login = async (body) => {
    const { email, password, software = "QRS Ecom" } = body

    if (!email?.trim() || !password?.trim()) {
        throw new AppError("Email and password are required", 400)
    }
    const normalizedEmail = email.trim().toLowerCase()

    const user = await authRepository.findByEmail(normalizedEmail)
    if (!user) {
        throw new AppError("Create account", 401)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new AppError("Invalid password", 401)
    }

    if (!user.isVerified) {
        const payload = {}
        if (!user.verificationExpireAt || user.verificationExpireAt < Date.now()) {
            payload.verificationToken = verificationToken()
            payload.verificationExpireAt = Date.now() + 24 * 60 * 60 * 1000
        }

        const updatedUser = Object.keys(payload).length
            ? await authRepository.updateById(user._id, payload)
            : user

        await MailService.sendVerificationMail(
            updatedUser.email,
            "Verify Your Email",
            updatedUser.verificationToken,
            software
        )

        return {
            statusCode: 200,
            payload: {
                message: "Please verify your email to login",
                status: "RESEND_VERIFICATION",
                user: sanitizeUser(updatedUser),
            },
        }
    }

    const updatedUser = await authRepository.updateById(user._id, {
        isLogin: true,
        lastLogin: Date.now(),
        verificationToken: undefined,
        verificationExpireAt: undefined,
    })

    const jwtToken = await generateJwtToken(updatedUser._id)

    return {
        statusCode: 200,
        payload: {
            message: "User logged in successfully",
            status: "LOGINED",
            user: sanitizeUser(updatedUser),
            jwtToken,
        },
    }
}

const verifyEmail = async (userId, body) => {
    const { code, software = "QRS Ecom" } = body

    if (!userId?.trim()) {
        throw new AppError("User id is required", 400)
    }
    if (!code?.trim() || code.length !== 6) {
        throw new AppError("Invalid code", 400)
    }

    const user = await authRepository.findById(userId)
    if (!user) {
        throw new AppError("User not found", 404)
    }
    if (user.isVerified) {
        throw new AppError("Email already verified", 400)
    }
    if (!user.verificationExpireAt || user.verificationExpireAt < Date.now()) {
        throw new AppError("Verification code expired", 400)
    }
    if (user.verificationToken !== code) {
        throw new AppError("Invalid code", 400)
    }

    const updatedUser = await authRepository.updateById(user._id, {
        isVerified: true,
        verificationToken: undefined,
        verificationExpireAt: undefined,
    })

    await MailService.sendWelcomeMail(updatedUser.email, "Welcome", software)

    return {
        statusCode: 200,
        payload: {
            message: "Email verified successfully",
            status: "VERIFIED",
            user: sanitizeUser(updatedUser),
        },
    }
}

const forgotPassword = async (body) => {
    const { email, software = "QRS Ecom" } = body

    if (!email?.trim()) {
        throw new AppError("Email is required", 400)
    }
    const normalizedEmail = email.trim().toLowerCase()

    const user = await authRepository.findByEmail(normalizedEmail)
    if (!user) {
        throw new AppError("User not found", 404)
    }

    const token = resetPasswordToken()
    const updatedUser = await authRepository.updateById(user._id, {
        resetPasswordToken: token,
        resetPasswordExpireAt: Date.now() + 60 * 60 * 1000,
    })

    const appUrl = process.env.FRONTEND_URL || "http://localhost:5173"
    const link = `${appUrl}/reset-password/${updatedUser.resetPasswordToken}`
    await MailService.forgotPassword(updatedUser.email, "Forgot password", link, software)

    return {
        statusCode: 200,
        payload: {
            message: "Password reset link sent to email",
            status: "FORGOT_PASSWORD_REQUEST",
            user: sanitizeUser(updatedUser),
        },
    }
}

const resetPassword = async (token, body) => {
    const { password, software = "QRS Ecom" } = body

    if (!token?.trim()) {
        throw new AppError("Token is required", 400)
    }
    if (!password?.trim()) {
        throw new AppError("Password is required", 400)
    }
    assertStrongPassword(password)

    const user = await authRepository.findByResetToken(token)
    if (!user) {
        throw new AppError("Invalid or expired token", 400)
    }

    const updatedUser = await authRepository.updateById(user._id, {
        password: await bcrypt.hash(password, 10),
        resetPasswordToken: undefined,
        resetPasswordExpireAt: undefined,
    })

    await MailService.passwordResetSuccess(updatedUser.email, "Password reset successful", software)

    return {
        statusCode: 200,
        payload: {
            message: "Password reset successfully",
            status: "PASSWORD_RESET_DONE",
            user: sanitizeUser(updatedUser),
        },
    }
}

const logout = async (userId) => {
    const user = await authRepository.findById(userId)
    if (!user) {
        throw new AppError("User not found", 404)
    }
    if (!user.isLogin) {
        throw new AppError("User is not logged in", 400)
    }

    await authRepository.updateById(user._id, {
        isLogin: false,
        lastLogout: Date.now(),
    })

    return {
        statusCode: 200,
        payload: {
            message: "User logged out successfully",
            status: "LOGOUT",
        },
    }
}

const getUser = async (userId) => {
    const user = await authRepository.findById(userId)
    if (!user) {
        throw new AppError("User not found", 404)
    }

    return {
        statusCode: 200,
        payload: {
            status: "USER_EXISTS",
            user: sanitizeUser(user),
        },
    }
}

const authService = {
    signup,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    getUser,
}

export default authService
