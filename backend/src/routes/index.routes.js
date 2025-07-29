"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import informeRoutes from "./informe.routes.js";
import asambleaRoutes from "./asamblea.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/informes", informeRoutes);
router.use("/asambleas", asambleaRoutes);

export default router;