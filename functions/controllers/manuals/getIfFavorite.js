import { executeQuery } from "../../db.js";
import { logRed } from "../../funciones/logsCustom.js";

export async function isManualFavorite(userId, manualId) {
    try {
        const query = `
        SELECT 1
        FROM favorites
        WHERE user_id = $1 AND manual_id = $2
        LIMIT 1
      `;
        const result = await executeQuery(query, [userId, manualId]);
        return result.length > 0;
    } catch (error) {
        logRed(`Error in FavoritesController.isManualFavorite: ${error.stack}`);
        throw error;
    }
}
