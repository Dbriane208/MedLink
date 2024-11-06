import { Router } from "express";
import { registerUser, loginUser, forgotPassword, resetPassword, updatePassword } from "../controllers/AuthController";
import { registerValidation, loginValidation } from "../validators/SchemaValidator";
import { validateRequest } from "../middlewares/ValidationMiddleware";
import { protect, restrictTo } from "../middlewares/AuthMiddleware";

const router = Router();

router.post("/register", registerValidation, validateRequest, registerUser);
router.post("/login", loginValidation, validateRequest, loginUser);
router.post("/forgot&password", forgotPassword);
router.post("/reset&password/:token", resetPassword);
router.patch("/update&password",protect, updatePassword);

export default router;