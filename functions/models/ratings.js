// models/Valoracion.js
import { logRed } from "../funciones/logsCustom.js";

class Rating {
    constructor({ id, usuario_id, manual_id, puntuacion, comentario, fecha }) {
        this.id = id;
        this.usuarioId = usuario_id;
        this.manualId = manual_id;
        this.puntuacion = puntuacion;
        this.comentario = comentario;
        this.fecha = fecha;
    }

    static fromJson(json) {
        try {
            return new Rating(json);
        } catch (error) {
            logRed(`Error en Valoracion.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            id: this.id,
            usuarioId: this.usuarioId,
            manualId: this.manualId,
            puntuacion: this.puntuacion,
            comentario: this.comentario,
            fecha: this.fecha,
        };
    }
}

export default Rating;
