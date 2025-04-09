import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Empresa from "../models/Empresa.js";

export async function updateEmpresa(id, nombre, descripcion) {
    try {
        const query =
            "UPDATE empresas SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *";
        const results = await executeQuery(query, [nombre, descripcion, id]);
        if (results.length === 0)
            throw new Error("No se pudo actualizar la empresa");
        return Empresa.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en EmpresaController.updateEmpresa: ${error.stack}`);
        throw error;
    }
}
