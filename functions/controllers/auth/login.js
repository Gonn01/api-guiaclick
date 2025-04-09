import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Usuario from "../models/Usuario.js";

export async function login(email, password) {
    try {
        const query = "SELECT * FROM usuarios WHERE email = $1 LIMIT 1";
        const results = await executeQuery(query, [email]);
        if (results.length === 0) throw new Error("Usuario no encontrado");
        const user = Usuario.fromJson(results[0]);
        // Para producción: comparar el password hasheado
        if (user.passwordHash !== password)
            throw new Error("Contraseña incorrecta");
        return user.toJson();
    } catch (error) {
        logRed(`Error en AuthController.login: ${error.stack}`);
        throw error;
    }
}