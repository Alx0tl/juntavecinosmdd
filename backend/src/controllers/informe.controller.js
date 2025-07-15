import Informe from "../entity/informe.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Tesorero crea informe
export async function crearInforme(req, res) {
  // Solo tesorero
  if (req.user.role !== "tesorero") return res.status(403).json({ message: "Solo el tesorero puede crear informes" });
  const { title, content } = req.body;
  const informeRepo = AppDataSource.getRepository(Informe);
  const nuevoInforme = informeRepo.create({ title, content, estado: "pendiente" });
  await informeRepo.save(nuevoInforme);
  res.status(201).json({ message: "Informe creado", data: nuevoInforme });
}

// Presidente deja observación
export async function dejarObservacion(req, res) {
  // Solo presidente
  if (req.user.role !== "Presidente") return res.status(403).json({ message: "Solo el presidente puede dejar observaciones" });
  const { id } = req.params;
  const { observacion } = req.body;
  const informeRepo = AppDataSource.getRepository(Informe);
  const informe = await informeRepo.findOne({ where: { id } });
  if (!informe) return res.status(404).json({ message: "Informe no encontrado" });
  informe.observaciones = observacion;
  informe.estado = "observado";
  await informeRepo.save(informe);
  // Aquí podrías notificar al tesorero
  res.status(200).json({ message: "Observación agregada", data: informe });
}

// Tesorero resuelve observación
export async function resolverObservacion(req, res) {
  if (req.user.role !== "tesorero") return res.status(403).json({ message: "Solo el tesorero puede resolver observaciones" });
  const { id } = req.params;
  const informeRepo = AppDataSource.getRepository(Informe);
  const informe = await informeRepo.findOne({ where: { id } });
  if (!informe) return res.status(404).json({ message: "Informe no encontrado" });
  informe.observaciones = null;
  informe.estado = "pendiente";
  await informeRepo.save(informe);
  res.status(200).json({ message: "Observación resuelta", data: informe });
}

// Presidente aprueba informe
export async function aprobarInforme(req, res) {
  if (req.user.role !== "Presidente") return res.status(403).json({ message: "Solo el presidente puede aprobar informes" });
  const { id } = req.params;
  const informeRepo = AppDataSource.getRepository(Informe);
  const informe = await informeRepo.findOne({ where: { id } });
  if (!informe) return res.status(404).json({ message: "Informe no encontrado" });
  if (informe.observaciones) return res.status(400).json({ message: "No se puede aprobar, hay observaciones pendientes" });
  informe.estado = "aprobado";
  await informeRepo.save(informe);
  res.status(200).json({ message: "Informe aprobado", data: informe });
}