import mongoose, { Schema } from "mongoose"

const categorySchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        imageUrl: { type: String, default: "" },
    },
    {
        timestamps: true,
        strict: true,
    }
)


categorySchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } })

const Category = mongoose.model("Category", categorySchema)

export default Category
