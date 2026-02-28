import asyncHandler from "express-async-handler"
import productService from "./product.service.js"

const getProducts = asyncHandler(async (req, res) => {
    const result = await productService.getProducts(req.query)
    return res.status(result.statusCode).json(result.payload)
})

const getBestSellersProducts = asyncHandler(async (_req, res) => {
    const result = await productService.getBestSellersProducts()
    return res.status(result.statusCode).json(result.payload)
})

const getTopOffersProducts = asyncHandler(async (_req, res) => {
    const result = await productService.getTopOffersProducts()
    return res.status(result.statusCode).json(result.payload)
})

const getCategories = asyncHandler(async (_req, res) => {
    const result = await productService.getCategories()
    return res.status(result.statusCode).json(result.payload)
})

const searchProducts = asyncHandler(async (req, res) => {
    const result = await productService.searchProducts(req.query)
    return res.status(result.statusCode).json(result.payload)
})

const getProductList = asyncHandler(async (_req, res) => {
    const result = await productService.getProductList()
    return res.status(result.statusCode).json(result.payload)
})

const getProduct = asyncHandler(async (req, res) => {
    const result = await productService.getProduct(req.params.id)
    return res.status(result.statusCode).json(result.payload)
})

const getSimilarProducts = asyncHandler(async (req, res) => {
    const result = await productService.getSimilarProducts(req.query)
    return res.status(result.statusCode).json(result.payload)
})

const productController = {
    getProducts,
    getBestSellersProducts,
    getTopOffersProducts,
    getCategories,
    searchProducts,
    getProductList,
    getProduct,
    getSimilarProducts,
}

export default productController
