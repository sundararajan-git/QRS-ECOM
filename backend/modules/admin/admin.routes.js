import { Router } from "express"
import adminController from "./admin.controller.js"
import { upload } from "../../middlewares/multer.middleware.js"
import { isAdmin, validUser } from "../../middlewares/auth.middleware.js"
import { validate } from "../../middlewares/validate.middleware.js"
import {
    addCategoryValidator,
    addProductValidator,
    updateProductValidator,
    deleteProductValidator,
    getProductsValidator,
} from "./admin.validators.js"

const router = Router()

router.post("/category", validUser, isAdmin, upload.single("image"), addCategoryValidator, validate, adminController.addCategories)
router.get("/products", validUser, isAdmin, getProductsValidator, validate, adminController.getProducts)
router.post("/product", validUser, isAdmin, upload.array("image", 4), addProductValidator, validate, adminController.addProduct)
router.put("/product", validUser, isAdmin, upload.array("image", 4), updateProductValidator, validate, adminController.updateProduct)
router.delete("/product/:id", validUser, isAdmin, deleteProductValidator, validate, adminController.deleteProduct)

export default router
