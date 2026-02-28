import Product from "./product.model.js"
import Homepage from "./homepage.model.js"
import Category from "./category.model.js"

const findAllProducts = async (filter = {}, options = {}) => {
    const {
        skip = 0,
        limit = 0,
        sort = { createdAt: -1, _id: -1 },
    } = options

    return Product.find(filter).skip(skip).limit(limit).sort(sort)
}

const findProductById = async (id) => Product.findById(id)

const countProductsBySearch = async (searchQuery) =>
    Product.countDocuments(searchQuery)

const findProductsBySearch = async (searchQuery, skip, limit) =>
    Product.find(searchQuery).skip(skip).limit(limit).sort({ createdAt: -1, _id: -1 })

const findHomepageWithProducts = async (field) =>
    Homepage.findOne().populate(field)

const findHomepageProductList = async () =>
    Homepage.findOne({}, "productSearchQuery")

const findSimilarProducts = async (category, excludedId, maxLimit = 4) =>
    Product.find({ category, _id: { $ne: excludedId } }).limit(maxLimit)

const findCategories = async () => Category.find()

const countProducts = async (filter = {}) => Product.countDocuments(filter)

const findByIds = async (ids) => Product.find({ _id: { $in: ids } })

const bulkWrite = async (ops) => Product.bulkWrite(ops)

const productRepository = {
    findAllProducts,
    findProductById,
    countProductsBySearch,
    findProductsBySearch,
    findHomepageWithProducts,
    findHomepageProductList,
    findSimilarProducts,
    findCategories,
    countProducts,
    findByIds,
    bulkWrite,
}

export default productRepository
