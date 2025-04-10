import { logRed } from "../../funciones/logsCustom.js";
import Usuario from "../../models/user.js";
import { executeQuery } from "../../db.js";

export async function registerUser(nombre, email, password) {
    try {
        const query =
            "INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING *";
        const results = await executeQuery(query, [nombre, email, password]);
        const user = Usuario.fromJson(results[0]);
        return user.toJson();
    } catch (error) {
        logRed(`Error en AuthController.registerUser: ${error.stack}`);
        throw error;
    }
}