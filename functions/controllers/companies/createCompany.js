import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Empresa from "../models/Empresa.js";

export async function createEmpresa(nombre, descripcion) {
    try {
        const query =
            "INSERT INTO empresas (nombre, descripcion) VALUES ($1, $2) RETURNING *";
        const results = await executeQuery(query, [nombre, descripcion]);
        return Empresa.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en EmpresaController.createEmpresa: ${error.stack}`);
        throw error;
    }
}