// src/routers/admin/admin.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../middlewares";

//enum
import { ENUM_AUTH_ROLES } from "../../constants/enums";

// controllers
import {
  SignInAdmin,
  SignUpAdmin,
  GetAllAdmins,
  GetAdminById,
  UpdateAdminById,
  DeleteAdminById,
} from "../../controllers";

//routes
router.post("/signin", SignInAdmin);
router.post("/signup", SignUpAdmin);
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN]),
  GetAllAdmins
);
router.get(
  "/find/:adminId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN]),
  GetAdminById
);
router.patch(
  "/update/:adminId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN]),
  UpdateAdminById
);
router.delete(
  "/delete/:adminId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN]),
  DeleteAdminById
);

export const AdminRouter = router;
