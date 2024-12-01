// src/routers/user/user.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../utils";

// controllers
import {
  SignInUser,
  SignUpUser,
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
  SignInUserWithGoogle,
} from "../../controllers";

//routes
router.post("/signin", SignInUser);
// Google OAuth callback route
router.get("/auth/google/callback", SignInUserWithGoogle);
router.post("/signup", SignUpUser);
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  GetAllUsers
);
router.get(
  "/find/:userId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  GetUserById
);
router.patch(
  "/update/:userId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  UpdateUserById
);
router.delete(
  "/delete/:userId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  DeleteUserById
);

export const UserRouter = router;
