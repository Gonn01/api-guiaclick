import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
// Suponemos que para los manuales se usa el modelo Manual
import Manual from "../models/Manual.js";

export async function getManualesPorEmpresa(empresaId) {
    try {
        const query = `
      SELECT m.*
      FROM manuales m
      JOIN manual_empresa me ON m.id = me.manual_id
      WHERE me.empresa_id = $1
    `;
        const results = await executeQuery(query, [empresaId]);
        return results.map(Manual.fromJson).map(m => m.toJson());
    } catch (error) {
        logRed(`Error en ManualEmpresaController.getManualesPorEmpresa: ${error.stack}`);
        throw error;
    }
}