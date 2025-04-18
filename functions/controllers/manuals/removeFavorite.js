import { executeQuery } from "../../db.js";
import { logRed } from "../../funciones/logsCustom.js";

export async function removeFavorite(userId, manualId) {
    try {
        const query = `
        DELETE FROM favorites
        WHERE user_id = $1 AND manual_id = $2
      `;
        await executeQuery(query, [userId, manualId]);
    } catch (error) {
        logRed(`Error in FavoritesController.removeFavorite: ${error.stack}`);
        throw error;
    }
}
