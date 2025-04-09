import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Empresa from "../models/Empresa.js";

export async function deleteEmpresa(id) {
    try {
        const query = "DELETE FROM empresas WHERE id = $1";
        await executeQuery(query, [id]);
        return { id, deleted: true };
    } catch (error) {
        logRed(`Error en EmpresaController.deleteEmpresa: ${error.stack}`);
        throw error;
    }
}