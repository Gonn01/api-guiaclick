import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import CodigoAcceso from "../models/CodigoAcceso.js";

export async function createCodigo(codigo, empresaId) {
    try {
        const query =
            "INSERT INTO codigos_acceso (codigo, empresa_id) VALUES ($1, $2) RETURNING *";
        const results = await executeQuery(query, [codigo, empresaId]);
        return CodigoAcceso.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en CodigoAccesoController.createCodigo: ${error.stack}`);
        throw error;
    }
}