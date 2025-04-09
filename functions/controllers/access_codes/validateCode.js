import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import CodigoAcceso from "../models/CodigoAcceso.js";

export async function validarCodigo(codigo) {
    try {
        const query = `
        SELECT * FROM codigos_acceso
        WHERE codigo = $1
          AND activo = true
          AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW())
      `;
        const results = await executeQuery(query, [codigo]);
        if (results.length === 0)
            throw new Error("Código no válido o expirado");
        return CodigoAcceso.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en CodigoAccesoController.validarCodigo: ${error.stack}`);
        throw error;
    }
}