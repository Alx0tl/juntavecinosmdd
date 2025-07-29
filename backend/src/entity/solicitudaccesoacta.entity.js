"use strict";
import { EntitySchema } from "typeorm";

export const SolicitudAccesoActaEntity = new EntitySchema({
  name: "SolicitudAccesoActa",
  tableName: "solicitudes_acceso_acta",
  columns: {
    id: { type: Number, primary: true, generated: true },
    userId: { type: Number, nullable: false },
    asambleaId: { type: Number, nullable: false },
    estado: { type: String, default: "pendiente" }, // pendiente, aprobada, rechazada
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
  }
});
export default SolicitudAccesoActaEntity;