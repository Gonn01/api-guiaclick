import { executeQuery } from "../../db.js";
import { logRed } from "../../funciones/logsCustom.js";
import { Manual } from "../../models/manual.js";

export async function listManuales() {
    try {
        const query = "SELECT * FROM manuals";
        const results = await executeQuery(query);
        return results.map(Manual.fromJson).map(m => m.toJson());
    } catch (error) {
        logRed(`Error en ManualController.listManuales: ${error.stack}`);
        throw error;
    }
}