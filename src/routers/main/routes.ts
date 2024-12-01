// src/routers/main/routes.ts
import express, { Router } from "express";
import { AdminRouter } from "..";

export const apiRouter = express.Router();

const apiRoutes: { path: string; route: Router }[] = [
  {
    path: "/admins",
    route: AdminRouter,
  },
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.route));
