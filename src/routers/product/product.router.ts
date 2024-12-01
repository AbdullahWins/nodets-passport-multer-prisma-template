// src/routers/product/product.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../utils";

// controllers
import {
  GetAllProducts,
  GetProductById,
  AddOneProduct,
  UpdateProductById,
  DeleteProductById,
} from "../../controllers";

//routes
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  GetAllProducts
);
router.get(
  "/find/:productId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  GetProductById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  AddOneProduct
);
router.patch(
  "/update/:productId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  UpdateProductById
);
router.delete(
  "/delete/:productId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  DeleteProductById
);

export const ProductRouter = router;
