import { executeQuery } from "../../db.js";
import { logRed } from "../../funciones/logsCustom.js";

export async function quitarFavorito(usuarioId, manualId) {
    try {
        const query =
            "DELETE FROM favoritos WHERE usuario_id = $1 AND manual_id = $2";
        await executeQuery(query, [usuarioId, manualId]);
        return { usuarioId, manualId, deleted: true };
    } catch (error) {
        logRed(`Error en FavoritoController.quitarFavorito: ${error.stack}`);
        throw error;
    }
}