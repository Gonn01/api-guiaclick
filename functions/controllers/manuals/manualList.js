import { executeQuery } from "../db/connection.js";
import { logRed } from "../funciones/logsCustom.js";
import Manual from "../models/Manual.js";

export async function listManuales() {
    try {
        const query = "SELECT * FROM manuales";
        const results = await executeQuery(query);
        return results.map(Manual.fromJson).map(m => m.toJson());
    } catch (error) {
        logRed(`Error en ManualController.listManuales: ${error.stack}`);
        throw error;
    }
}