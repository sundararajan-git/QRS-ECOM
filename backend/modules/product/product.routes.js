import { Router } from "express"
import productController from "./product.controller.js"


const router = Router()

router.get("/products", productController.getProducts)
router.get("/product/:id", productController.getProduct)
router.get("/search", productController.searchProducts)
router.get("/product-lists", productController.getProductList)
router.get("/best-sellers", productController.getBestSellersProducts)
router.get("/top-offers", productController.getTopOffersProducts)
router.get("/categories", productController.getCategories)
router.get("/products/similar-products", productController.getSimilarProducts)
router.get("/products/smilar-products", productController.getSimilarProducts)


export default router
