import { executeQuery } from "../../db.js";
import { logRed } from "../../funciones/logsCustom.js";

export async function getManualSteps(manualId) {
    try {
        const query = `
        SELECT
          *
        FROM steps
        WHERE manual_id = $1
        ORDER BY "order" ASC
      `;
        const result = await executeQuery(query, [manualId]);

        // Convert created_at to ISO string
        return result.map((row) => ({
            ...row,
            created_at: row.created_at?.toISOString?.() ?? null,
        }));
    } catch (error) {
        logRed(`Error in StepsController.getManualSteps: ${error.stack}`);
        throw error;
    }
}
