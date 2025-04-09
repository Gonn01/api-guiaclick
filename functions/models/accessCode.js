// models/CodigoAcceso.js
import { logRed } from "../funciones/logsCustom.js";

class AccessCode {
    constructor({ id, codigo, empresa_id, activo, fecha_expiracion }) {
        this.id = id;
        this.codigo = codigo;
        this.empresaId = empresa_id;
        this.activo = activo;
        this.fechaExpiracion = fecha_expiracion;
    }

    static fromJson(json) {
        try {
            return new AccessCode(json);
        } catch (error) {
            logRed(`Error en CodigoAcceso.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            id: this.id,
            codigo: this.codigo,
            empresaId: this.empresaId,
            activo: this.activo,
            fechaExpiracion: this.fechaExpiracion,
        };
    }
}

export default AccessCode;
