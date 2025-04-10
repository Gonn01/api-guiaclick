import { logRed } from "../../funciones/logsCustom.js";
import { executeQuery } from "../../db.js";

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