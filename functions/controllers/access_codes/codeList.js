import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import CodigoAcceso from "../models/CodigoAcceso.js";

export async function listCodigos() {
    try {
        const query = "SELECT * FROM codigos_acceso";
        const results = await executeQuery(query);
        return results.map(CodigoAcceso.fromJson).map(c => c.toJson());
    } catch (error) {
        logRed(`Error en CodigoAccesoController.listCodigos: ${error.stack}`);
        throw error;
    }
}