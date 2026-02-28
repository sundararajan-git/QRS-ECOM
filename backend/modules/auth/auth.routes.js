import { Router } from "express"
import authController from "./auth.controller.js"
import { validUser } from "../../middlewares/auth.middleware.js"
import { validate } from "../../middlewares/validate.middleware.js"
import {
    signupValidator,
    loginValidator,
    verifyEmailValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} from "./auth.validators.js"

const router = Router()

router.post("/signup", signupValidator, validate, authController.signup)
router.post("/login", loginValidator, validate, authController.login)
router.post("/verify-email/:id", verifyEmailValidator, validate, authController.verifyEmail)
router.post("/forgot-password", forgotPasswordValidator, validate, authController.forgotPassword)
router.put("/reset-password/:token", resetPasswordValidator, validate, authController.resetPassword)
router.post("/logout", validUser, authController.logout)
router.get("/valid-user", validUser, authController.getUser)

export default router
