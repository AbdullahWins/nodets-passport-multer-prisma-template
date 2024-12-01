// src/routers/ticket/ticket.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../utils";

// controllers
import {
  GetAllTickets,
  GetTicketById,
  AddOneTicket,
  AddManyTickets,
  UpdateTicketById,
  DeleteTicketById,
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
  GetAllTickets
);
router.get(
  "/find/:ticketId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  GetTicketById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  AddOneTicket
);
router.post(
  "/add-many",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  AddManyTickets
);
router.patch(
  "/update/:ticketId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  UpdateTicketById
);
router.delete(
  "/delete/:ticketId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  DeleteTicketById
);

export const TicketRouter = router;
