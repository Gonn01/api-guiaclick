import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Categoria from "../models/Categoria.js";

export async function listCategorias() {
    try {
        const query = "SELECT * FROM categorias";
        const results = await executeQuery(query);
        return results.map(Categoria.fromJson).map(c => c.toJson());
    } catch (error) {
        logRed(`Error en CategoriaController.listCategorias: ${error.stack}`);
        throw error;
    }
}
