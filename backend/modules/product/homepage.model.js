import mongoose, { Schema, Types } from "mongoose"

const homepageSchema = new Schema(
    {
        bestSellers: [{ type: Types.ObjectId, ref: "Product", default: [] }],
        topOffers: [{ type: Types.ObjectId, ref: "Product", default: [] }],
        productSearchQuery: [{ type: String, default: [] }],
    },
    {
        timestamps: true,
        strict: true,
    }
)

const Homepage = mongoose.model("Homepage", homepageSchema)

export default Homepage
