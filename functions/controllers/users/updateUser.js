import { logRed } from "../../funciones/logsCustom.js";
import Usuario from "../../models/user.js";
import { executeQuery } from "../../db.js";

export async function updateUser(id, nombre, email) {
    try {
        const query =
            "UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3 RETURNING *";
        const results = await executeQuery(query, [nombre, email, id]);
        if (results.length === 0) throw new Error("No se pudo actualizar el usuario");
        return Usuario.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en UserController.updateUser: ${error.stack}`);
        throw error;
    }
}