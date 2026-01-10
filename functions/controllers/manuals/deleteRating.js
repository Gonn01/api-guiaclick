import { executeQuery } from "../../db.js";
import { logRed } from "../../funciones/logsCustom.js";

export async function deleteRating(userId, manualId) {
    try {
        const query = `
        DELETE FROM ratings
        WHERE id = $1
      `;
        await executeQuery(query, [manualId], true);
    } catch (error) {
        logRed(`Error in RatingsController.deleteRating: ${error.stack}`);
        throw error;
    }
}
