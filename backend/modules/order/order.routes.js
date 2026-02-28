import { Router } from "express"
import orderController from "./order.controller.js"
import { validUser } from "../../middlewares/auth.middleware.js"
import { validate } from "../../middlewares/validate.middleware.js"
import { createOrderValidator, getOrderByIdValidator } from "./order.validators.js"

const router = Router()

router.get("/", validUser, orderController.getOrders)
router.get("/:id", validUser, getOrderByIdValidator, validate, orderController.getOrderById)
router.post("/", validUser, createOrderValidator, validate, orderController.createOrder)

export default router
