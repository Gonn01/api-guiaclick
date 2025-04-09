import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Valoracion from "../models/Valoracion.js";

export async function crearValoracion(usuarioId, manualId, puntuacion, comentario) {
    try {
        const query =
            "INSERT INTO valoraciones (usuario_id, manual_id, puntuacion, comentario) VALUES ($1, $2, $3, $4) RETURNING *";
        const results = await executeQuery(query, [usuarioId, manualId, puntuacion, comentario]);
        return Valoracion.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en ValoracionController.crearValoracion: ${error.stack}`);
        throw error;
    }
}