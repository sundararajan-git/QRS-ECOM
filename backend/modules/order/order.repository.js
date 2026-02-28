import Order from "./order.model.js"

const findByUser = async (userId) =>
    Order.find({ user: userId }).sort({ createdAt: -1 }).populate("items.product")

const findByUserAndId = async (userId, orderId) =>
    Order.findOne({ _id: orderId, user: userId }).populate("items.product")

const createOrder = async (payload) => Order.create(payload)

const orderRepository = {
    findByUser,
    findByUserAndId,
    createOrder,
}

export default orderRepository
