import { body } from "express-validator"

export const updateProfileValidator = [
    body("username")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 2, max: 50 }).withMessage("Username must be between 2 and 50 characters"),

    body("profilePic")
        .optional()
        .trim()
        .isURL().withMessage("Profile picture must be a valid URL"),
]
