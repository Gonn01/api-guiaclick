// models/Empresa.js
import { logRed } from "../funciones/logsCustom.js";

class Company {
    constructor({ id, nombre, descripcion, creado_en }) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.creadoEn = creado_en;
    }

    static fromJson(json) {
        try {
            return new Company(json);
        } catch (error) {
            logRed(`Error en Empresa.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion,
            creadoEn: this.creadoEn,
        };
    }
}

export default Company;
