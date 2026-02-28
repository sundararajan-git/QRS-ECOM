import { body, param, query } from "express-validator"

export const addCategoryValidator = [
    body("category")
        .trim()
        .notEmpty().withMessage("Category name is required")
        .escape()
        .isLength({ min: 2, max: 100 }).withMessage("Category name must be between 2 and 100 characters"),
]

export const addProductValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Product name is required")
        .escape()
        .isLength({ min: 2, max: 200 }).withMessage("Product name must be between 2 and 200 characters"),

    body("description")
        .trim()
        .notEmpty().withMessage("Product description is required")
        .escape()
        .isLength({ min: 5, max: 2000 }).withMessage("Product description must be between 5 and 2000 characters"),

    body("price")
        .notEmpty().withMessage("Price is required")
        .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),

    body("discountPrice")
        .notEmpty().withMessage("Discount price is required")
        .isFloat({ min: 0 }).withMessage("Discount price must be a non-negative number"),

    body("unit")
        .trim()
        .notEmpty().withMessage("Unit is required")
        .escape(),

    body("stock")
        .notEmpty().withMessage("Stock is required")
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

    body("category")
        .trim()
        .notEmpty().withMessage("Category is required")
        .escape(),
]

export const updateProductValidator = [
    body("_id")
        .trim()
        .notEmpty().withMessage("Product id is required")
        .isMongoId().withMessage("Product id must be a valid id"),

    body("name")
        .trim()
        .notEmpty().withMessage("Product name is required")
        .escape()
        .isLength({ min: 2, max: 200 }).withMessage("Product name must be between 2 and 200 characters"),

    body("description")
        .trim()
        .notEmpty().withMessage("Product description is required")
        .escape()
        .isLength({ min: 5, max: 2000 }).withMessage("Product description must be between 5 and 2000 characters"),

    body("price")
        .notEmpty().withMessage("Price is required")
        .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),

    body("discountPrice")
        .notEmpty().withMessage("Discount price is required")
        .isFloat({ min: 0 }).withMessage("Discount price must be a non-negative number"),

    body("unit")
        .trim()
        .notEmpty().withMessage("Unit is required")
        .escape(),

    body("stock")
        .notEmpty().withMessage("Stock is required")
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

    body("category")
        .trim()
        .notEmpty().withMessage("Category is required")
        .escape(),
]

export const deleteProductValidator = [
    param("id")
        .trim()
        .notEmpty().withMessage("Product id is required")
        .isMongoId().withMessage("Product id must be a valid id"),
]

export const getProductsValidator = [
    query("pageNo")
        .notEmpty().withMessage("Page number is required")
        .isInt({ min: 1 }).withMessage("Page number must be a positive integer"),

    query("limit")
        .notEmpty().withMessage("Limit is required")
        .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
]
