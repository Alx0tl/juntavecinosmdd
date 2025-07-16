"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Middleware que permite a administradores y secretarios
export async function isAdminOrSecretario(req, res, next) {
  try {
    // Buscar el usuario en la base de datos
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({
      email: req.user?.email,
    });

    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const rolUser = userFound.role;

    // Permitir si el rol es Administrador o Secretario (respetando mayúsculas)
    if (!["Administrador", "Secretario"].includes(rolUser)) {
      return res.status(403).json({
        message:
          "Acceso restringido. Se requiere ser Administrador o Secretario para esta acción.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}
