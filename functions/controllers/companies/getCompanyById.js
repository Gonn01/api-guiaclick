import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Empresa from "../models/Empresa.js";

export async function getEmpresaById(id) {
    try {
        const query = "SELECT * FROM empresas WHERE id = $1";
        const results = await executeQuery(query, [id]);
        if (results.length === 0) throw new Error("Empresa no encontrada");
        return Empresa.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en EmpresaController.getEmpresaById: ${error.stack}`);
        throw error;
    }
}