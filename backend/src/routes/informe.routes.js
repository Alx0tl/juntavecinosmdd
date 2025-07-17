import { Router } from "express";
import { getInformes, crearInforme, dejarObservacion, editarInforme, aprobarInforme} from "../controllers/informe.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();
router.use(authenticateJwt);

router.post("/", crearInforme); // tesorero
router.put("/:id/observacion", dejarObservacion); // presidente
router.put("/:id", editarInforme); // tesorero
router.put("/:id/aprobar", aprobarInforme); // presidente
router.get("/", getInformes); // presidente, tesorero, secretario

export default router;