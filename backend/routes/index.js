import { Router } from "express"
import authRoutes from "../modules/auth/auth.routes.js"
import productRoutes from "../modules/product/product.routes.js"
import adminRoutes from "../modules/admin/admin.routes.js"
import userRoutes from "../modules/user/user.routes.js"
import orderRoutes from "../modules/order/order.routes.js"


const router = Router()


router.use("/", productRoutes)
router.use("/auth", authRoutes)
router.use("/product", productRoutes)
router.use("/admin", adminRoutes)
router.use("/user", userRoutes)
router.use("/order", orderRoutes)

export default router
