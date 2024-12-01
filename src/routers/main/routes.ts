// src/routers/main/routes.ts
import express, { Router } from "express";
import {
  AdminRouter,
  GameRouter,
  ProductRouter,
  StoreRouter,
  TicketRouter,
  UserRouter,
} from "..";

export const apiRouter = express.Router();

const apiRoutes: { path: string; route: Router }[] = [
  {
    path: "/users",
    route: UserRouter,
  },
  {
    path: "/admins",
    route: AdminRouter,
  },
  {
    path: "/stores",
    route: StoreRouter,
  },
  {
    path: "/games",
    route: GameRouter,
  },
  {
    path: "/products",
    route: ProductRouter,
  },
  {
    path: "/tickets",
    route: TicketRouter,
  },
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.route));
