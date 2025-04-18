import { executeQuery } from "../../db.js";
import { logRed } from "../../funciones/logsCustom.js";

export async function addFavorite(userId, manualId) {
    try {
        const query = `
        INSERT INTO favorites (user_id, manual_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `;
        await executeQuery(query, [userId, manualId]);
    } catch (error) {
        logRed(`Error in FavoritesController.addFavorite: ${error.stack}`);
        throw error;
    }
}
