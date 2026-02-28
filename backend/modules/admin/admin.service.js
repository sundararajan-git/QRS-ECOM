import fs from "fs"
import { AppError } from "../../utils/AppError.js"
import cloudinary from "../../config/cloudinary.js"
import adminRepository from "./admin.repository.js"

const CATEGORY_CLOUDINARY_FOLDER =
    process.env.CLOUDINARY_CATEGORY_FOLDER || "QRS_ECOM/CATEGORIES"
const PRODUCT_CLOUDINARY_FOLDER =
    process.env.CLOUDINARY_PRODUCT_FOLDER || "QRS_ECOM"

const CURATED_CATEGORY_IMAGE_MAP = {
    electronics:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    fashion:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80",
    "home kitchen":
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80",
    "beauty care":
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    "sports fitness":
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80",
    "books learning":
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80",
    "office tech":
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
}

const safeUnlink = (filePath) => {
    if (!filePath) return
    try {
        fs.unlinkSync(filePath)
    } catch (_error) {

    }
}

const isCloudinaryConfigured = () =>
    Boolean(process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)

const uploadImageToCloudinary = async (filePath, folder = PRODUCT_CLOUDINARY_FOLDER) => {
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return ""
    }

    const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: "image",
    })

    return result.secure_url
}

const uploadRemoteImageToCloudinary = async (imageUrl, folder = CATEGORY_CLOUDINARY_FOLDER, publicId = "") => {
    if (!imageUrl?.trim()) {
        return ""
    }
    if (!isCloudinaryConfigured()) {
        return imageUrl
    }

    const payload = {
        folder,
        resource_type: "image",
    }
    if (publicId) {
        payload.public_id = publicId
        payload.overwrite = true
    }

    const result = await cloudinary.uploader.upload(imageUrl, payload)
    return result.secure_url || imageUrl
}

const slugify = (value) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `category-${Date.now()}`

const normalizeCategoryKey = (value) =>
    value
        .toLowerCase()
        .replace(/&/g, " ")
        .replace(/[^a-z0-9]+/g, " ")
        .trim()
        .replace(/\s+/g, " ")

const findCategoryImageFromInternet = async (categoryName) => {
    const curated = CURATED_CATEGORY_IMAGE_MAP[normalizeCategoryKey(categoryName)]
    if (curated) {
        return curated
    }

    return `https://loremflickr.com/1600/900/${encodeURIComponent(categoryName)}`
}

const addCategories = async (body, file) => {
    const { category } = body

    if (!category?.trim()) {
        throw new AppError("Category is required", 400)
    }
    const categoryName = category.trim().replace(/\s+/g, " ")
    const existingCategory = await adminRepository.findCategoryByName(categoryName)
    if (existingCategory) {
        throw new AppError("Category already exists", 409)
    }

    let imageUrl = ""
    if (file?.path) {
        try {
            imageUrl = await uploadImageToCloudinary(file.path, CATEGORY_CLOUDINARY_FOLDER)
        } finally {
            safeUnlink(file.path)
        }
    } else {
        const internetImageUrl = await findCategoryImageFromInternet(categoryName)
        try {
            imageUrl = await uploadRemoteImageToCloudinary(
                internetImageUrl,
                CATEGORY_CLOUDINARY_FOLDER,
                slugify(categoryName)
            )
        } catch {
            imageUrl = internetImageUrl || ""
        }
    }

    let addedCategory = null
    try {
        addedCategory = await adminRepository.createCategory({
            name: categoryName,
            imageUrl,
        })
    } catch (error) {
        if (error?.code === 11000) {
            throw new AppError("Category already exists", 409)
        }
        throw error
    }

    return {
        statusCode: 201,
        payload: {
            addedCategory,
            status: "CREATED",
        },
    }
}

const getProducts = async (query) => {
    const pageNo = parseInt(query.pageNo, 10)
    const limit = parseInt(query.limit, 10)

    if (!pageNo || !limit) {
        throw new AppError("Page no & limit is required", 400)
    }

    const skip = (pageNo - 1) * limit

    const [products, totalProducts] = await Promise.all([
        adminRepository.findProductsPaginated(skip, limit),
        adminRepository.countProducts(),
    ])

    return {
        statusCode: 200,
        payload: {
            status: "FETCHED",
            products,
            totalPages: Math.ceil(totalProducts / limit),
        },
    }
}

const addProduct = async (body, files) => {
    const {
        name,
        description,
        price,
        unit,
        stock,
        category,
        discountPrice,
    } = body

    if (!name || !description || !price || !unit || !stock || !category || !discountPrice) {
        throw new AppError("Invalid keys", 400)
    }

    let images = []
    if (Array.isArray(files) && files.length > 0) {
        images = await Promise.all(
            files.map(async (file) => {
                try {
                    return (await uploadImageToCloudinary(file.path, PRODUCT_CLOUDINARY_FOLDER)) || ""
                } finally {
                    safeUnlink(file.path)
                }
            })
        )
        images = images.filter(Boolean)
    }

    const product = await adminRepository.createProduct({
        name,
        description,
        price: Number(price),
        unit,
        stock: Number(stock),
        category,
        discountPrice: Number(discountPrice),
        images,
    })

    return {
        statusCode: 201,
        payload: {
            status: "CREATED",
            product,
        },
    }
}

const updateProduct = async (body, files) => {
    const {
        _id,
        name,
        description,
        price,
        unit,
        stock,
        category,
        discountPrice,
    } = body

    if (!name || !description || !price || !unit || !stock || !category || !discountPrice || !_id) {
        throw new AppError("Invalid keys", 400)
    }

    const payload = {
        name,
        description,
        price: Number(price),
        unit,
        stock: Number(stock),
        category,
        discountPrice: Number(discountPrice),
    }

    if (Array.isArray(files) && files.length > 0) {
        let images = await Promise.all(
            files.map(async (file) => {
                try {
                    return (await uploadImageToCloudinary(file.path, PRODUCT_CLOUDINARY_FOLDER)) || ""
                } finally {
                    safeUnlink(file.path)
                }
            })
        )
        images = images.filter(Boolean)
        if (images.length > 0) {
            payload.images = images
        }
    }

    const product = await adminRepository.updateProductById(_id, payload)
    if (!product) {
        throw new AppError("Product not found", 404)
    }

    return {
        statusCode: 200,
        payload: {
            status: "UPDATED",
            product,
        },
    }
}

const deleteProduct = async (id) => {
    if (!id?.trim()) {
        throw new AppError("Product id is required", 400)
    }

    const product = await adminRepository.deleteProductById(id)
    if (!product) {
        throw new AppError("Product not found", 404)
    }

    return {
        statusCode: 200,
        payload: {
            status: "DELETED",
            message: "Product deleted successfully",
        },
    }
}

const adminService = {
    addCategories,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
}

export default adminService
