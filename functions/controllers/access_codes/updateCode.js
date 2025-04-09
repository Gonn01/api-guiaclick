import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import CodigoAcceso from "../models/CodigoAcceso.js";

export async function updateCodigo(id, data) {
    try {
        let fields = [];
        let values = [];
        let i = 1;
        if (data.codigo !== undefined) {
            fields.push(`codigo = $${i}`);
            values.push(data.codigo);
            i++;
        }
        if (data.activo !== undefined) {
            fields.push(`activo = $${i}`);
            values.push(data.activo);
            i++;
        }
        if (data.fecha_expiracion !== undefined) {
            fields.push(`fecha_expiracion = $${i}`);
            values.push(data.fecha_expiracion);
            i++;
        }
        if (fields.length === 0)
            throw new Error("No hay campos para actualizar");
        const query = `UPDATE codigos_acceso SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`;
        values.push(id);
        const results = await executeQuery(query, values);
        if (results.length === 0)
            throw new Error("No se pudo actualizar el código");
        return CodigoAcceso.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en CodigoAccesoController.updateCodigo: ${error.stack}`);
        throw error;
    }
}