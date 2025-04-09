import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Empresa from "../models/Empresa.js";

export async function listEmpresas() {
    try {
        const query = "SELECT * FROM empresas";
        const results = await executeQuery(query);
        return results.map(Empresa.fromJson).map(e => e.toJson());
    } catch (error) {
        logRed(`Error en EmpresaController.listEmpresas: ${error.stack}`);
        throw error;
    }
}