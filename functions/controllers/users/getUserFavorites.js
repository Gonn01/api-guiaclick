import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Usuario from "../models/Usuario.js";
import Favorito from "../models/Favorito.js";

export async function getUserFavorites(userId) {
    try {
        const query = `
        SELECT m.*
        FROM manuales m
        JOIN favoritos f ON m.id = f.manual_id
        WHERE f.usuario_id = $1
      `;
        const results = await executeQuery(query, [userId]);
        // Suponemos que el modelo Manual existe y se importa si se requiere conversión
        return results; // O mapear a instancias de Manual si lo deseas
    } catch (error) {
        logRed(`Error en UserController.getUserFavorites: ${error.stack}`);
        throw error;
    }
}