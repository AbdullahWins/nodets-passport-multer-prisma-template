// src/routers/store/store.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../utils";

// controllers
import {
  SignInStore,
  VerifyOtpStore,
  AddOneStore,
  GetAllStores,
  GetStoreById,
  UpdateStoreById,
  DeleteStoreById,
} from "../../controllers";

//routes
router.post("/signin", SignInStore);
router.post("/verify", VerifyOtpStore);
router.post(
  "/signup",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN]),
  AddOneStore
);
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.STORE_ADMIN, ENUM_AUTH_ROLES.SUPER_ADMIN]),
  GetAllStores
);
router.get(
  "/find/:storeId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.STORE_ADMIN, ENUM_AUTH_ROLES.SUPER_ADMIN]),
  GetStoreById
);
router.patch(
  "/update/:storeId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.STORE_ADMIN, ENUM_AUTH_ROLES.SUPER_ADMIN]),
  UpdateStoreById
);
router.delete(
  "/delete/:storeId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.STORE_ADMIN, ENUM_AUTH_ROLES.SUPER_ADMIN]),
  DeleteStoreById
);

export const StoreRouter = router;
