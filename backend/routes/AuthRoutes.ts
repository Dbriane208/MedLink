import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/AuthController";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/UserController";
import {
  registerValidation,
  loginValidation,
} from "../validators/UserSchemaValidator";
import { validateRequest } from "../middlewares/ValidationMiddleware";
import { protect, restrictTo } from "../middlewares/AuthMiddleware";
import fileUpload, { UploadedFile } from 'express-fileupload';

const router = Router();

router.post("/register", registerValidation, validateRequest, registerUser);
router.post("/login", loginValidation, validateRequest, loginUser);
router.post("/forgot&password", protect, forgotPassword);
router.post("/reset&password/:token", protect, resetPassword);
router.patch("/update&password", protect, updatePassword);

router.get("/", protect, restrictTo("admin"), getAllUsers);
router
  .route("/:id")
  .get(protect, restrictTo("admin"), getUserById)
  .patch(protect, updateUserById)
  .delete(protect, restrictTo("admin"), deleteUserById);

// Enable file upload
router.use(fileUpload());



export default router;
