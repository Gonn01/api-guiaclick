import { executeQuery } from "../../db.js";
import { logGreen, logRed } from "../../funciones/logsCustom.js";

export async function getUserFavorites(userId) {
    try {
        const query = `
        SELECT m.*
        FROM favorites f
        JOIN manuals m ON m.id = f.manual_id
        WHERE f.user_id = $1
      `;
        const result = await executeQuery(query, [userId]);
        logGreen(`FavoritesController.getUserFavorites: ${JSON.stringify(result)}`);
        return result;
    } catch (error) {
        logRed(`Error in FavoritesController.getUserFavorites: ${error.stack}`);
        throw error;
    }
}
