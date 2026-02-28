import { body, param } from "express-validator"

export const createOrderValidator = [
    body("items")
        .isArray({ min: 1 }).withMessage("Items must be a non-empty array"),

    body("items.*.product")
        .trim()
        .notEmpty().withMessage("Each item must have a product id")
        .isMongoId().withMessage("Each item product id must be a valid id"),

    body("items.*.quantity")
        .isInt({ min: 1 }).withMessage("Each item must have a quantity of at least 1"),

    body("paymentMethod")
        .optional()
        .trim()
        .escape()
        .isString().withMessage("Payment method must be a string")
        .isLength({ max: 50 }).withMessage("Payment method must be under 50 characters"),

    body("shippingAddress")
        .optional()
        .isObject().withMessage("Shipping address must be an object"),

    body("shippingAddress.street")
        .optional()
        .trim()
        .escape()
        .isString().withMessage("Street must be a string")
        .isLength({ max: 255 }).withMessage("Street is too long"),

    body("shippingAddress.city")
        .optional()
        .trim()
        .escape()
        .isString().withMessage("City must be a string")
        .isLength({ max: 100 }).withMessage("City is too long"),

    body("shippingAddress.state")
        .optional()
        .trim()
        .escape()
        .isString().withMessage("State must be a string")
        .isLength({ max: 100 }).withMessage("State is too long"),

    body("shippingAddress.postalCode")
        .optional()
        .trim()
        .escape()
        .isString().withMessage("Postal code must be a string")
        .isLength({ max: 20 }).withMessage("Postal code is too long"),

    body("shippingAddress.country")
        .optional()
        .trim()
        .escape()
        .isString().withMessage("Country must be a string")
        .isLength({ max: 100 }).withMessage("Country is too long"),
]

export const getOrderByIdValidator = [
    param("id")
        .trim()
        .notEmpty().withMessage("Order id is required")
        .isMongoId().withMessage("Order id must be a valid id"),
]
