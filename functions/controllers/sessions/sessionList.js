import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";

export async function listarSesiones() {
    try {
        const query = "SELECT * FROM sesiones ORDER BY fecha_inicio DESC";
        return await executeQuery(query);
    } catch (error) {
        logRed(`Error en SesionController.listarSesiones: ${error.stack}`);
        throw error;
    }
}
