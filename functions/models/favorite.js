// models/Favorito.js
import { logRed } from "../funciones/logsCustom.js";

class Favorite {
    constructor({ usuario_id, manual_id }) {
        this.usuarioId = usuario_id;
        this.manualId = manual_id;
    }

    static fromJson(json) {
        try {
            return new Favorite(json);
        } catch (error) {
            logRed(`Error en Favorito.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            usuarioId: this.usuarioId,
            manualId: this.manualId,
        };
    }
}

export default Favorite;
