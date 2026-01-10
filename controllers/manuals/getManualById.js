import { executeQuery } from "../../db.js";
import { logRed } from "../../funciones/logsCustom.js";

export async function getManualById(id) {
    try {
        const query = "SELECT * FROM manuals WHERE id = $1";
        const results = await executeQuery(query, [id]);

        return results[0];
    } catch (error) {
        logRed(`Error en ManualController.getManualById: ${error.stack}`);
        throw error;
    }
}