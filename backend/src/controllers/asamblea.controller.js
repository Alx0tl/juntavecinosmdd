import Asamblea from "../entity/asamblea.entity.js";
import SolicitudAccesoActa from "../entity/solicitudAccesoActa.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { In } from "typeorm";

// Secretario agenda asamblea futura
export async function crearAsamblea(req, res) {
  try {
    const { fecha, descripcion } = req.body;
    const asambleaRepo = AppDataSource.getRepository(Asamblea);
    const nuevaAsamblea = asambleaRepo.create({
      fecha,
      descripcion,
      estado: "pendiente",
      fase: "agendada",
    });
    await asambleaRepo.save(nuevaAsamblea);
    res.status(201).json({ message: "Asamblea agendada", data: nuevaAsamblea });
  } catch (error) {
    res.status(500).json({ message: "Error al agendar asamblea" });
  }
}

// Secretario sube acta de asamblea pasada
export async function subirActa(req, res) {
  try {
    const { id } = req.params;
    const { actaUrl } = req.body; // O usa req.file si subes archivos
    const asambleaRepo = AppDataSource.getRepository(Asamblea);
    const asamblea = await asambleaRepo.findOne({ where: { id } });
    if (!asamblea) return res.status(404).json({ message: "Asamblea no encontrada" });
    asamblea.actaUrl = actaUrl;
    asamblea.fase = "pasada";
    asamblea.estado = "pendiente";
    await asambleaRepo.save(asamblea);
    res.status(200).json({ message: "Acta subida", data: asamblea });
  } catch (error) {
    res.status(500).json({ message: "Error al subir acta" });
  }
}

// Presidente aprueba asamblea/acta
export async function aprobarAsamblea(req, res) {
  try {
    const { id } = req.params;
    const asambleaRepo = AppDataSource.getRepository(Asamblea);
    const asamblea = await asambleaRepo.findOne({ where: { id } });
    if (!asamblea) return res.status(404).json({ message: "Asamblea no encontrada" });
    if (asamblea.observaciones) return res.status(400).json({ message: "No se puede aprobar, hay observaciones pendientes" });
    asamblea.estado = "aprobada";
    await asambleaRepo.save(asamblea);
    // Aquí deberías notificar a los miembros
    res.status(200).json({ message: "Asamblea aprobada", data: asamblea });
  } catch (error) {
    res.status(500).json({ message: "Error al aprobar asamblea" });
  }
}

// Presidente deja observación
export async function observarAsamblea(req, res) {
  try {
    const { id } = req.params;
    const { observacion } = req.body;
    const asambleaRepo = AppDataSource.getRepository(Asamblea);
    const asamblea = await asambleaRepo.findOne({ where: { id } });
    if (!asamblea) return res.status(404).json({ message: "Asamblea no encontrada" });
    asamblea.observaciones = observacion;
    asamblea.estado = "observada";
    await asambleaRepo.save(asamblea);
    res.status(200).json({ message: "Observación agregada", data: asamblea });
  } catch (error) {
    res.status(500).json({ message: "Error al dejar observación" });
  }
}

// Obtener asambleas (visibilidad depende del rol)
export async function getAsambleas(req, res) {
  try {
    const asambleaRepo = AppDataSource.getRepository(Asamblea);
    let asambleas = await asambleaRepo.find();
    // Si es miembro, solo ve asambleas aprobadas (y solo la fecha y descripción)
    if (req.user.role === "Miembro") {
      asambleas = asambleas
        .filter(a => a.estado === "aprobada")
        .map(a => ({
          id: a.id,
          fecha: a.fecha,
          descripcion: a.descripcion,
          estado: a.estado,
          fase: a.fase,
        }));
    }
    res.status(200).json({ message: "Asambleas encontradas", data: asambleas });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener asambleas" });
  }
}

// Obtener acta (solo directiva o miembros con acceso aprobado)
export async function getActa(req, res) {
  try {
    const { id } = req.params;
    const asambleaRepo = AppDataSource.getRepository(Asamblea);
    const asamblea = await asambleaRepo.findOne({ where: { id } });
    if (!asamblea) return res.status(404).json({ message: "Asamblea no encontrada" });

    // Directiva siempre puede ver el acta
    if (["Presidente", "Tesorero", "Secretario"].includes(req.user.role)) {
      return res.status(200).json({ actaUrl: asamblea.actaUrl, data: asamblea });
    }

    // Miembro: solo si tiene solicitud aprobada
    const solicitudRepo = AppDataSource.getRepository(SolicitudAccesoActa);
    const solicitud = await solicitudRepo.findOne({
      where: { userId: req.user.id, asambleaId: Number(id), estado: "aprobada" }
    });
    if (!solicitud) return res.status(403).json({ message: "No tienes acceso a esta acta" });

    res.status(200).json({ actaUrl: asamblea.actaUrl, data: asamblea });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener acta" });
  }
}

// Miembro solicita acceso a acta
export async function solicitarAccesoActa(req, res) {
  try {
    const { id } = req.params;
    const asambleaRepo = AppDataSource.getRepository(Asamblea);
    const asamblea = await asambleaRepo.findOne({ where: {id: Number(id)}});
    if (!asamblea) return res.status(400).json({message: "Asamblea no encontrada"});
    if (!asamblea.actaUrl) return res.status(400).json({ message: "Esta asamblea no tiene acta disponible" });

    const solicitudRepo = AppDataSource.getRepository(SolicitudAccesoActa);
    const asambleaIdNum = Number(id);
    // Verifica si ya existe una solicitud pendiente o aprobada
    const existe = await solicitudRepo.findOne({
      where: {
        userId: Number(req.user.id),
        asambleaId: Number(id),
        estado: In(["pendiente", "aprobada"])
      }
    });
    if (existe) return res.status(400).json({ message: "Ya tienes una solicitud pendiente o aprobada" });

    const nuevaSolicitud = solicitudRepo.create({
      userId: req.user.id,
      asambleaId: asambleaIdNum,
      estado: "pendiente"
    });
    await solicitudRepo.save(nuevaSolicitud);
    res.status(201).json({ message: "Solicitud enviada", data: nuevaSolicitud });
  } catch (error) {
    console.error("Error real al solicitar acceso:", error);
    res.status(500).json({ message: "Error al solicitar acceso", error: error.message });
  }
}

// Secretario ve solicitudes de acceso a acta

export async function getTodasSolicitudes(req, res) {
  try {
    const solicitudRepo = AppDataSource.getRepository(SolicitudAccesoActa);
    const solicitudes = await solicitudRepo.find();
    res.status(200).json({ data: solicitudes });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener solicitudes" });
  }
}

export async function getSolicitudesActa(req, res) {
  try {
    const { id } = req.params;
    const solicitudRepo = AppDataSource.getRepository(SolicitudAccesoActa);
    const solicitudes = await solicitudRepo.find({ where: { asambleaId: id } });
    res.status(200).json({ data: solicitudes });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener solicitudes" });
  }
}

// Secretario aprueba solicitud de acceso
export async function aprobarSolicitudActa(req, res) {
  try {
    const { solicitudId } = req.params;
    const solicitudRepo = AppDataSource.getRepository(SolicitudAccesoActa);
    const solicitud = await solicitudRepo.findOne({ where: { id: solicitudId } });
    if (!solicitud) return res.status(404).json({ message: "Solicitud no encontrada" });
    solicitud.estado = "aprobada";
    await solicitudRepo.save(solicitud);
    // Notifica al usuario
    res.status(200).json({ message: "Solicitud aprobada", data: solicitud });
  } catch (error) {
    res.status(500).json({ message: "Error al aprobar solicitud" });
  }
}

// Secretario rechaza solicitud de acceso
export async function rechazarSolicitudActa(req, res) {
  try {
    const { solicitudId } = req.params;
    const solicitudRepo = AppDataSource.getRepository(SolicitudAccesoActa);
    const solicitud = await solicitudRepo.findOne({ where: { id: solicitudId } });
    if (!solicitud) return res.status(404).json({ message: "Solicitud no encontrada" });
    solicitud.estado = "rechazada";
    await solicitudRepo.save(solicitud);
    res.status(200).json({ message: "Solicitud rechazada", data: solicitud });
  } catch (error) {
    res.status(500).json({ message: "Error al rechazar solicitud" });
  }
}