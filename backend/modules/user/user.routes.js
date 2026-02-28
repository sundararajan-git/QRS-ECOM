import { Router } from "express"
import userController from "./user.controller.js"
import { validUser } from "../../middlewares/auth.middleware.js"
import { validate } from "../../middlewares/validate.middleware.js"
import { updateProfileValidator } from "./user.validators.js"

const router = Router()

router.get("/", validUser, userController.getProfile)
router.patch("/", validUser, updateProfileValidator, validate, userController.updateProfile)
router.delete("/", validUser, userController.deleteProfile)

export default router
