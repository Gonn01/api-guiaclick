import { executeQuery } from "../../db.js";
import { logRed } from "../../funciones/logsCustom.js";

export async function deleteRating(userId, manualId) {
    try {
        const query = `
        DELETE FROM ratings
        WHERE user_id = $1 AND manual_id = $2
      `;
        await executeQuery(query, [userId, manualId]);
    } catch (error) {
        logRed(`Error in RatingsController.deleteRating: ${error.stack}`);
        throw error;
    }
}
