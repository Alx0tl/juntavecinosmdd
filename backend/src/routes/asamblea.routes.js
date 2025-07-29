import { Router } from "express";
import {
  crearAsamblea,
  subirActa,
  aprobarAsamblea,
  observarAsamblea,
  getAsambleas,
  getActa,
  solicitarAccesoActa,
  aprobarSolicitudActa,
  rechazarSolicitudActa,
  getSolicitudesActa,
  getTodasSolicitudes,
} from "../controllers/asamblea.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import {
  isSecretario,
  isPresidente,
  isMiembro,
  isPresidenteTesoreroSecretario,
} from "../middleware/authorization.middleware.js";

const router = Router();
router.use(authenticateJwt);

// Secretario agenda asamblea futura
router.post("/", isSecretario, crearAsamblea);

// Secretario sube acta de asamblea pasada
router.post("/:id/acta", isSecretario, subirActa);

// Presidente aprueba asamblea/acta
router.put("/:id/aprobar", isPresidente, aprobarAsamblea);

// Presidente deja observación
router.put("/:id/observacion", isPresidente, observarAsamblea);

// Obtener asambleas (visibilidad depende del rol)
router.get("/", getAsambleas);


// Obtener acta (solo directiva o miembros con acceso aprobado)
router.get("/:id/acta", getActa);

// Miembro solicita acceso a acta
router.post("/:id/solicitar-acceso", isMiembro, solicitarAccesoActa);

// Secretario ve solicitudes de acceso a acta
router.get("/:id/solicitudes-acceso", isSecretario, getSolicitudesActa);

// secretario ve todas las solicitudes de acceso
router.get("/solicitudes-acceso", isSecretario, getTodasSolicitudes);

// Secretario aprueba/rechaza solicitud de acceso
router.put("/solicitudes-acceso/:solicitudId/aprobar", isSecretario, aprobarSolicitudActa);
router.put("/solicitudes-acceso/:solicitudId/rechazar", isSecretario, rechazarSolicitudActa);

export default router;
