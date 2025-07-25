import { Router } from "express";
import { getInformes, crearInforme, dejarObservacion, editarInforme, aprobarInforme} from "../controllers/informe.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { isTesorero, isPresidente, isPresidenteTesoreroSecretario } from "../middleware/authorization.middleware.js";

const router = Router();
router.use(authenticateJwt);

router.post("/", isTesorero, crearInforme); // solo tesorero
router.put("/:id/observacion", isPresidente, dejarObservacion); // solo presidente
router.put("/:id", isTesorero, editarInforme); // solo tesorero
router.put("/:id/aprobar", isPresidente, aprobarInforme); // solo presidente

router.get("/", isPresidenteTesoreroSecretario, getInformes); // presidente, tesorero, secretario

export default router;