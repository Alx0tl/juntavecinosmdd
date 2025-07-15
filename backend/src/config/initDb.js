"use strict";

import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

// Función para crear usuarios por defecto
// Se aplica sólo al iniciar la base de datos
export async function createUsers() {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const count = await userRepository.count();
        if (count > 0) return;
        const users = [
            {
                username: "Presidente",
                rut: "12345678-9",
                email: "presi@gmail.com",
                password: await encryptPassword("presi123"),
                role: "Presidente"
            },
             {
                username: "Tesorero",
                rut: "11223456-7",
                email: "tes@gmail.com",
                password: await encryptPassword("tes123"),
                role: "tesorero"
            },
             {
                username: "Secretario",
                rut: "15345678-9",
                email: "sec@gmail.com",
                password: await encryptPassword("sec123"),
                role: "Secretario"
            },
            {
                username: "Usuario",
                rut: "98765432-1",
                email: "usuario@gmail.com",
                password: await encryptPassword("usuario123"),
                role: "usuario"
            }
        ]

        console.log("Creando usuarios...");

        for (const user of users) {
            await userRepository.save((
                userRepository.create(user)
            ));
            console.log(`Usuario '${user.username}' creado exitosamente.`);
        }
    } catch (error) {
        console.error("Error al crear usuarios: ", error);
        process.exit(1);
    }
}