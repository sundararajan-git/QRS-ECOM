import mongoose, { Schema } from "mongoose"

const productSchema = Schema({
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    unit: { type: String },
    stock: { type: Number },
    category: { type: String },
    discountPrice: { type: Number },
    totalReviews: { type: Number },
    rating: { type: Number },
    images: [
        { type: String }
    ]
}, {
    timestamps: true,
    strict: true,
})

productSchema.index({ name: "text", category: "text", description: "text" })
productSchema.index({ category: 1, createdAt: -1 })
productSchema.index({ price: 1, discountPrice: 1 })
productSchema.index({ stock: 1 })

const product = mongoose.model("Product", productSchema)

export default product
