// models/Administrador.js
import { logRed } from "../funciones/logsCustom.js";

class Admin {
    constructor({ id, usuario_id, nivel_acceso }) {
        this.id = id;
        this.usuarioId = usuario_id;
        this.nivelAcceso = nivel_acceso;
    }

    static fromJson(json) {
        try {
            return new Admin(json);
        } catch (error) {
            logRed(`Error en Administrador.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            id: this.id,
            usuarioId: this.usuarioId,
            nivelAcceso: this.nivelAcceso,
        };
    }
}

export default Admin;
