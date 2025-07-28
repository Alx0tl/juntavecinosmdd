import Informe from "../entity/informe.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Tesorero crea informe
export async function crearInforme(req, res) {
  // Solo tesorero
  try {
  const { title, content } = req.body;
  const informeRepo = AppDataSource.getRepository(Informe);
  const nuevoInforme = informeRepo.create({ title, content, estado: "pendiente" });
  await informeRepo.save(nuevoInforme);
  res.status(201).json({ message: "Informe creado", data: nuevoInforme });
  } catch (error) {
    console.error("Error en informe.controller.js -> crearInforme(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

// Tesorero elimina informe
export async function deleteInforme(req, res) {
  try {
    const { id } = req.params;
    const informeRepo = AppDataSource.getRepository(Informe);
    const informe = await informeRepo.findOne({ where: { id } });
    if (!informe) {
      return res.status(404).json({ message: "Informe no encontrado" });
    }
    await informeRepo.remove(informe);
    res.status(200).json({ message: "Informe eliminado correctamente" });
  } catch (error) {
    console.error("Error en informe.controller.js -> deleteInforme(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getInformes(req, res) {
  // Permitir solo presidente, tesorero y secretario
  try {
  const informeRepo = AppDataSource.getRepository(Informe);
  const informes = await informeRepo.find();
  res.status(200).json({ message: "Informes encontrados", data: informes });
  } catch (error) {
    console.error("Error en informe.controller.js -> getInformes(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

// Presidente deja observación
export async function dejarObservacion(req, res) {
  // Solo presidente
  try {
  const { id } = req.params;
  const { observacion } = req.body;
  const informeRepo = AppDataSource.getRepository(Informe);
  const informe = await informeRepo.findOne({ where: { id } });
  if (!informe) return res.status(404).json({ message: "Informe no encontrado" });
  informe.observaciones = observacion;
  informe.estado = "observado";
  await informeRepo.save(informe);
  // Notificacion tesorero
  res.status(200).json({ message: "Observación agregada", data: informe });
  } catch (error) {
    console.error("Error en informe.controller.js -> dejarObservacion(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

// Tesorero edita informe
export async function editarInforme(req, res) {
  try {
  const { id } = req.params;
  const { title, content } = req.body;
  const informeRepo = AppDataSource.getRepository(Informe);
  const informe = await informeRepo.findOne({ where: { id } });
  if (!informe) return res.status(404).json({ message: "Informe no encontrado" });
  if (informe.estado !== "pendiente" && informe.estado !== "observado") {
    return res.status(400).json({ message: "Solo se pueden editar informes pendientes u observados" });
  }
  informe.title = title || informe.title;
  informe.content = content || informe.content;
  // Si el informe estaba observado, al editarlo pasa a pendiente y se eliminan observaciones
  if (informe.estado === "observado") {
    informe.estado = "pendiente";
    informe.observaciones = null;
  }
  await informeRepo.save(informe);
  res.status(200).json({ message: "Informe editado", data: informe });
  } catch (error) {
    console.error("Error en informe.controller.js -> editarInforme(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

// Presidente aprueba informe
export async function aprobarInforme(req, res) {
  try {
  const { id } = req.params;
  const informeRepo = AppDataSource.getRepository(Informe);
  const informe = await informeRepo.findOne({ where: { id } });
  if (!informe) return res.status(404).json({ message: "Informe no encontrado" });
  if (informe.observaciones) return res.status(400).json({ message: "No se puede aprobar, hay observaciones pendientes" });
  informe.estado = "aprobado";
  await informeRepo.save(informe);
  res.status(200).json({ message: "Informe aprobado", data: informe });
  } catch (error) {
    console.error("Error en informe.controller.js -> aprobarInforme(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}