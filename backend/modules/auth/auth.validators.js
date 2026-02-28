import { body, param } from "express-validator"

const PASSWORD_MSG =
    "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&)"

export const signupValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage(PASSWORD_MSG),
]

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required"),
]

export const verifyEmailValidator = [
    param("id")
        .trim()
        .notEmpty().withMessage("User id is required"),

    body("code")
        .trim()
        .notEmpty().withMessage("Verification code is required")
        .isNumeric().withMessage("Verification code must be numeric")
        .isLength({ min: 6, max: 6 }).withMessage("Verification code must be exactly 6 characters")
        .escape(),
]

export const forgotPasswordValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail(),
]

export const resetPasswordValidator = [
    param("token")
        .trim()
        .notEmpty().withMessage("Reset token is required"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage(PASSWORD_MSG),
]
