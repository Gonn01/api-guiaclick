import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Feedback from "../models/Feedback.js";

export async function enviarFeedback(usuarioId, mensaje) {
    try {
        const query =
            "INSERT INTO feedback (usuario_id, mensaje) VALUES ($1, $2) RETURNING *";
        const results = await executeQuery(query, [usuarioId, mensaje]);
        return Feedback.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en FeedbackController.enviarFeedback: ${error.stack}`);
        throw error;
    }
}