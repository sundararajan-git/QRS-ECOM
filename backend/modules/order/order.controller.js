import asyncHandler from "express-async-handler"
import orderService from "./order.service.js"

const getOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getOrders(req.userId)
    return res.status(result.statusCode).json(result.payload)
})

const getOrderById = asyncHandler(async (req, res) => {
    const result = await orderService.getOrderById(req.userId, req.params.id)
    return res.status(result.statusCode).json(result.payload)
})

const createOrder = asyncHandler(async (req, res) => {
    const result = await orderService.createOrder(req.userId, req.body)
    return res.status(result.statusCode).json(result.payload)
})

const orderController = {
    getOrders,
    getOrderById,
    createOrder,
}

export default orderController
