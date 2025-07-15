import { Router } from "express";
import { crearInforme, dejarObservacion, resolverObservacion, aprobarInforme } from "../controllers/informe.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();
router.use(authenticateJwt);

router.post("/", crearInforme); // tesorero
router.put("/:id/observacion", dejarObservacion); // presidente
router.put("/:id/resolver", resolverObservacion); // tesorero
router.put("/:id/aprobar", aprobarInforme); // presidente

export default router;