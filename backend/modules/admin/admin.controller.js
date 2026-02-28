import asyncHandler from "express-async-handler"
import adminService from "./admin.service.js"

const addCategories = asyncHandler(async (req, res) => {
    const result = await adminService.addCategories(req.body, req.file)
    return res.status(result.statusCode).json(result.payload)
})

const getProducts = asyncHandler(async (req, res) => {
    const result = await adminService.getProducts(req.query)
    return res.status(result.statusCode).json(result.payload)
})

const addProduct = asyncHandler(async (req, res) => {
    const result = await adminService.addProduct(req.body, req.files)
    return res.status(result.statusCode).json(result.payload)
})

const updateProduct = asyncHandler(async (req, res) => {
    const result = await adminService.updateProduct(req.body, req.files)
    return res.status(result.statusCode).json(result.payload)
})

const deleteProduct = asyncHandler(async (req, res) => {
    const result = await adminService.deleteProduct(req.params.id)
    return res.status(result.statusCode).json(result.payload)
})

const adminController = {
    addCategories,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
}

export default adminController
