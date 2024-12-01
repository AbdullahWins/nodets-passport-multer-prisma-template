// src/routers/game/game.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../utils";

// controllers
import {
  GetAllGames,
  GetGameById,
  AddOneGame,
  UpdateGameById,
  DeleteGameById,
} from "../../controllers";

//routes
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_USER]),
  GetAllGames
);
router.get(
  "/find/:gameId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  GetGameById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  AddOneGame
);
router.patch(
  "/update/:gameId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  UpdateGameById
);
router.delete(
  "/delete/:gameId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  DeleteGameById
);

export const GameRouter = router;
