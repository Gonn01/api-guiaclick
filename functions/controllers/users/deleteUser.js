import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Usuario from "../models/Usuario.js";
import Favorito from "../models/Favorito.js";

export async function deleteUser(id) {
    try {
        const query = "DELETE FROM usuarios WHERE id = $1";
        await executeQuery(query, [id]);
        return { id, deleted: true };
    } catch (error) {
        logRed(`Error en UserController.deleteUser: ${error.stack}`);
        throw error;
    }
}