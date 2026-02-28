import mongoose, { Schema, Types } from "mongoose";

const orderSchema = Schema({
    user: { type: Types.ObjectId, ref: "User" },
    items: [
        {
            product: { type: Types.ObjectId, ref: "Product" },
            quantity: Number,
            price: Number,
        }
    ],
    totalAmount: Number,
    status: { type: String, default: "pending" },
    paymentMethod: String,
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
    },
}, {
    timestamps: true,
    strict: true,
});

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

const Order = mongoose.model("Order", orderSchema)

export default Order
