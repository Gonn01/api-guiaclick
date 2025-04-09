// models/ManualCategoria.js
import { logRed } from "../funciones/logsCustom.js";

class RelationManualCategory {
    constructor({ manual_id, categoria_id }) {
        this.manualId = manual_id;
        this.categoriaId = categoria_id;
    }

    static fromJson(json) {
        try {
            return new RelationManualCategory(json);
        } catch (error) {
            logRed(`Error en ManualCategoria.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            manualId: this.manualId,
            categoriaId: this.categoriaId,
        };
    }
}

export default RelationManualCategory;
