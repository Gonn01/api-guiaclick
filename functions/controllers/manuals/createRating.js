import { executeQuery } from "../../db.js";
import { logCyan, logRed } from "../../funciones/logsCustom.js";

export async function createRating({ user_id, manual_id, score = null, comment = null }) {
    logCyan(`Creating rating for user_id: ${user_id}, manual_id: ${manual_id}, score: ${score}, comment: ${comment}`);
    try {
        const query = `
        INSERT INTO ratings (user_id, manual_id, score, comment, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id, manual_id) DO UPDATE
        SET score = EXCLUDED.score,
            comment = EXCLUDED.comment,
            created_at = NOW()
        RETURNING *;
      `;
        const result = await executeQuery(query, [user_id, manual_id, score, comment]);
        return result[0];
    } catch (error) {
        logRed(`Error in RatingsController.createRating: ${error.stack}`);
        throw error;
    }
}
