// models/ManualEmpresa.js
import { logRed } from "../funciones/logsCustom.js";

class RelationManualCompany {
    constructor({ manual_id, empresa_id }) {
        this.manualId = manual_id;
        this.empresaId = empresa_id;
    }

    static fromJson(json) {
        try {
            return new RelationManualCompany(json);
        } catch (error) {
            logRed(`Error en ManualEmpresa.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            manualId: this.manualId,
            empresaId: this.empresaId,
        };
    }
}

export default RelationManualCompany;
