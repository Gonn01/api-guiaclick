import { executeQuery } from "../../db.js";
import { logCyan, logRed } from "../../funciones/logsCustom.js";
import Rating from "../../models/ratings.js";

export async function listarValoracionesManual(manualId) {
    try {
        const query = "SELECT * FROM ratings WHERE manual_id = $1";

        const results = await executeQuery(query, [manualId]);
        if (results.length === 0) {
            return [];
        }
        return results.map(Rating.fromJson).map(v => v.toJson());
    } catch (error) {
        logRed(`Error en ValoracionController.listarValoracionesManual: ${error.stack}`);
        throw error;
    }
}
