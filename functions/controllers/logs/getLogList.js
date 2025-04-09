import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";

export async function listarLogs() {
    try {
        const query = "SELECT * FROM logs ORDER BY fecha DESC";
        return await executeQuery(query);
    } catch (error) {
        logRed(`Error en LogController.listarLogs: ${error.stack}`);
        throw error;
    }
}