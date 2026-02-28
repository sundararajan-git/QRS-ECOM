import { AppError } from "../../utils/AppError.js"
import productRepository from "./product.repository.js"

const parsePagination = (query) => {
    const currentPage = Math.max(parseInt(query.page, 10) || 1, 1)
    const pageLimit = Math.max(parseInt(query.limit, 10) || 10, 1)
    const skip = (currentPage - 1) * pageLimit
    return { currentPage, pageLimit, skip }
}

const buildSort = (sortBy) => {
    switch (sortBy) {
        case "price_asc":
            return { discountPrice: 1, price: 1 }
        case "price_desc":
            return { discountPrice: -1, price: -1 }
        case "rating_desc":
            return { rating: -1, totalReviews: -1 }
        case "name_asc":
            return { name: 1 }
        case "name_desc":
            return { name: -1 }
        default:
            return { createdAt: -1, _id: -1 }
    }
}

const buildBaseFilter = (query) => {
    const { category, minPrice, maxPrice } = query
    const filter = {}

    if (category?.trim()) {
        filter.category = category.trim()
    }

    if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) {
            filter.price.$gte = Number(minPrice)
        }
        if (maxPrice) {
            filter.price.$lte = Number(maxPrice)
        }
    }

    return filter
}

const getProducts = async (query = {}) => {
    const { currentPage, pageLimit, skip } = parsePagination(query)
    const filter = buildBaseFilter(query)
    const sort = buildSort(query.sort)

    if (query.q?.trim()) {
        filter.$or = [
            { name: { $regex: query.q, $options: "i" } },
            { category: { $regex: query.q, $options: "i" } },
            { description: { $regex: query.q, $options: "i" } },
        ]
    }

    const [totalProducts, products] = await Promise.all([
        productRepository.countProducts(filter),
        productRepository.findAllProducts(filter, { skip, limit: pageLimit, sort }),
    ])

    return {
        statusCode: 200,
        payload: {
            products,
            currentPage,
            totalPages: Math.ceil(totalProducts / pageLimit),
            totalProducts,
            status: "FETCHED",
        },
    }
}

const getBestSellersProducts = async () => {
    const homepage = await productRepository.findHomepageWithProducts("bestSellers")
    return {
        statusCode: 200,
        payload: {
            products: homepage?.bestSellers || [],
            status: "FETCHED",
        },
    }
}

const getTopOffersProducts = async () => {
    const homepage = await productRepository.findHomepageWithProducts("topOffers")
    return {
        statusCode: 200,
        payload: {
            products: homepage?.topOffers || [],
            status: "FETCHED",
        },
    }
}

const getCategories = async () => {
    const categories = await productRepository.findCategories()
    return {
        statusCode: 200,
        payload: {
            categories: categories || [],
            status: "FETCHED",
        },
    }
}

const searchProducts = async (query) => {
    const { q } = query

    if (!q?.trim()) {
        throw new AppError("Query is required", 400)
    }

    const { currentPage, pageLimit, skip } = parsePagination(query)
    const searchQuery = buildBaseFilter(query)
    const sort = buildSort(query.sort)

    searchQuery.$or = [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
    ]

    const [totalProducts, products] = await Promise.all([
        productRepository.countProducts(searchQuery),
        productRepository.findAllProducts(searchQuery, { skip, limit: pageLimit, sort }),
    ])

    return {
        statusCode: 200,
        payload: {
            products,
            currentPage,
            totalPages: Math.ceil(totalProducts / pageLimit),
            totalProducts,
            status: "FETCHED",
        },
    }
}

const getProductList = async () => {
    const productList = await productRepository.findHomepageProductList()
    return {
        statusCode: 200,
        payload: {
            productsList: productList || [],
            status: "FETCHED",
        },
    }
}

const getProduct = async (id) => {
    if (!id?.trim()) {
        throw new AppError("Id is required", 400)
    }

    const product = await productRepository.findProductById(id)
    if (!product) {
        throw new AppError("Product not found", 404)
    }

    return {
        statusCode: 200,
        payload: {
            product,
            status: "FETCHED",
        },
    }
}

const getSimilarProducts = async (query) => {
    const { category, id } = query

    if (!category?.trim() || !id?.trim()) {
        throw new AppError("Category or id is required", 400)
    }

    const products = await productRepository.findSimilarProducts(category, id, 4)

    return {
        statusCode: 200,
        payload: {
            products,
            status: "FETCHED",
        },
    }
}

const productService = {
    getProducts,
    getBestSellersProducts,
    getTopOffersProducts,
    getCategories,
    searchProducts,
    getProductList,
    getProduct,
    getSimilarProducts,
}

export default productService
