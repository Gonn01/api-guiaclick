import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Favorito from "../models/Favorito.js";

export async function agregarFavorito(usuarioId, manualId) {
    try {
        const query =
            "INSERT INTO favoritos (usuario_id, manual_id) VALUES ($1, $2) RETURNING *";
        const results = await executeQuery(query, [usuarioId, manualId]);
        return Favorito.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en FavoritoController.agregarFavorito: ${error.stack}`);
        throw error;
    }
}
