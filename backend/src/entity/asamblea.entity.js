"use strict";
import { EntitySchema } from "typeorm";

export const AsambleaEntity = new EntitySchema({
  name: "Asamblea",
  tableName: "asambleas",
  columns: {
    id: { type: Number, primary: true, generated: true },
    fecha: { type: "timestamp", nullable: false },
    descripcion: { type: String, nullable: false },
    estado: { type: String, default: "pendiente" }, // pendiente, aprobado, observado
    observaciones: { type: String, nullable: true },
    actaUrl: { type: String, nullable: true }, // URL o path del acta subida
    fase: { type: String, default: "agendada" },
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
  },
  relations: {
    
  }
});
export default AsambleaEntity;