import { logRed } from "../../funciones/logsCustom.js";
import Usuario from "../../models/user.js";
import { executeQuery } from "../../db.js";

export async function logoutUser(userId) {
    try {
        // Aquí se podría eliminar o invalidar el token, según la implementación
        return { userId, loggedOut: true };
    } catch (error) {
        logRed(`Error en AuthController.logoutUser: ${error.stack}`);
        throw error;
    }
}