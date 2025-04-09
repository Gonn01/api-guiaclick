// models/Feedback.js
import { logRed } from "../funciones/logsCustom.js";

class Feedback {
    constructor({ id, usuario_id, mensaje, fecha }) {
        this.id = id;
        this.usuarioId = usuario_id;
        this.mensaje = mensaje;
        this.fecha = fecha;
    }

    static fromJson(json) {
        try {
            return new Feedback(json);
        } catch (error) {
            logRed(`Error en Feedback.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            id: this.id,
            usuarioId: this.usuarioId,
            mensaje: this.mensaje,
            fecha: this.fecha,
        };
    }
}

export default Feedback;
