"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Middleware solo para secretario
export async function isSecretario(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({
      email: req.user?.email,
    });

    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (userFound.role !== "Secretario") {
      return res.status(403).json({
        message: "Acceso restringido. Se requiere ser Secretario para esta acción.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
    }

// Middleware solo para Tesorero
export async function isTesorero(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({
      email: req.user?.email,
    });

    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (userFound.role !== "Tesorero") {
      return res.status(403).json({
        message: "Acceso restringido. Se requiere ser Tesorero para esta acción.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
    }

    // Middleware solo para Presidente
export async function isPresidente(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({
      email: req.user?.email,
    });

    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (userFound.role !== "Presidente") {
      return res.status(403).json({
        message: "Acceso restringido. Se requiere ser Presidente para esta acción.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

export async function isPresidenteTesoreroSecretario(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({
      email: req.user?.email,
    });

    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (!["Presidente", "Tesorero", "Secretario"].includes(userFound.role)) {
      return res.status(403).json({
        message: "Acceso restringido. Se requiere ser Presidente, Tesorero o Secretario para esta acción.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

export async function isMiembro(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userFound = await userRepository.findOneBy({
      email: req.user?.email,
    });

    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (userFound.role !== "Miembro") {
      return res.status(403).json({
        message: "Acceso restringido. Se requiere ser Miembro para esta acción.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}