import { executeQuery } from "../../db.js";
import { logRed } from "../../funciones/logsCustom.js";
import Manual from "../../models/manual.js";

export async function getManualById(id) {
    try {
        const query = "SELECT * FROM manuals WHERE id = $1";
        const results = await executeQuery(query, [id]);
        if (results.length === 0) throw new Error("Manual no encontrado");
        return Manual.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en ManualController.getManualById: ${error.stack}`);
        throw error;
    }
}