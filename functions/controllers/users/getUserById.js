import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Usuario from "../models/Usuario.js";
import Favorito from "../models/Favorito.js";

export async function getUserById(id) {
    try {
        const query = "SELECT * FROM usuarios WHERE id = $1";
        const results = await executeQuery(query, [id]);
        if (results.length === 0) throw new Error("Usuario no encontrado");
        return Usuario.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en UserController.getUserById: ${error.stack}`);
        throw error;
    }
}
