import Product from "../product/product.model.js"
import Category from "../product/category.model.js"

const createCategory = async (payload) => Category.create(payload)
const findCategoryByName = async (name) =>
    Category.findOne({ name: name.trim() }).collation({ locale: "en", strength: 2 })

const findProductsPaginated = async (skip, limit) =>
    Product.find().skip(skip).limit(limit).sort({ createdAt: -1 })

const countProducts = async () => Product.countDocuments()

const createProduct = async (payload) => Product.create(payload)

const updateProductById = async (id, payload) =>
    Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

const deleteProductById = async (id) => Product.findByIdAndDelete(id)

const adminRepository = {
    createCategory,
    findCategoryByName,
    findProductsPaginated,
    countProducts,
    createProduct,
    updateProductById,
    deleteProductById,
}

export default adminRepository
