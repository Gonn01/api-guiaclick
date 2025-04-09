import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import CodigoAcceso from "../models/CodigoAcceso.js";

export async function deleteCodigo(id) {
    try {
        const query = "DELETE FROM codigos_acceso WHERE id = $1";
        await executeQuery(query, [id]);
        return { id, deleted: true };
    } catch (error) {
        logRed(`Error en CodigoAccesoController.deleteCodigo: ${error.stack}`);
        throw error;
    }
}