import { AppError } from "../../utils/AppError.js"
import orderRepository from "./order.repository.js"
import productRepository from "../product/product.repository.js"

const normalizeItems = (items) =>
    items.map((item) => ({
        product: item.product,
        quantity: Number(item.quantity),
        price: Number(item.price),
    }))

const getOrders = async (userId) => {
    const orders = await orderRepository.findByUser(userId)
    return {
        statusCode: 200,
        payload: {
            status: "FETCHED",
            orders,
        },
    }
}

const getOrderById = async (userId, orderId) => {
    if (!orderId?.trim()) {
        throw new AppError("Order id is required", 400)
    }

    const order = await orderRepository.findByUserAndId(userId, orderId)
    if (!order) {
        throw new AppError("Order not found", 404)
    }

    return {
        statusCode: 200,
        payload: {
            status: "FETCHED",
            order,
        },
    }
}

const createOrder = async (userId, body) => {
    const { items, paymentMethod, shippingAddress } = body

    if (!Array.isArray(items) || items.length === 0) {
        throw new AppError("Items are required", 400)
    }

    const normalizedItems = normalizeItems(items)
    const invalidItem = normalizedItems.find(
        (item) => !item.product || !item.quantity || item.quantity < 1
    )
    if (invalidItem) {
        throw new AppError("Invalid order item", 400)
    }

    const productIds = normalizedItems.map((item) => item.product)
    const products = await productRepository.findByIds(productIds)
    const productMap = new Map(products.map((product) => [product._id.toString(), product]))

    const orderItems = normalizedItems.map((item) => {
        const product = productMap.get(item.product.toString())
        if (!product) {
            throw new AppError("Product not found", 404)
        }
        if (product.stock < item.quantity) {
            throw new AppError(`Insufficient stock for ${product.name}`, 400)
        }

        const unitPrice = Number(product.discountPrice || product.price || 0)
        return {
            product: product._id,
            quantity: item.quantity,
            price: unitPrice,
        }
    })

    const totalAmount = orderItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0
    )

    const order = await orderRepository.createOrder({
        user: userId,
        items: orderItems,
        totalAmount,
        paymentMethod: paymentMethod || "",
        shippingAddress: shippingAddress || {},
    })

    await productRepository.bulkWrite(
        orderItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stock: -item.quantity } },
            },
        }))
    )

    return {
        statusCode: 201,
        payload: {
            status: "CREATED",
            order,
        },
    }
}

const orderService = {
    getOrders,
    getOrderById,
    createOrder,
}

export default orderService
