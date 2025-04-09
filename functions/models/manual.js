// models/Manual.js
import { logRed } from "../funciones/logsCustom.js";

class Manual {
    constructor({ id, titulo, descripcion, contenido, publico, creado_por, creado_en }) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        // Se asume que 'contenido' es un JSON almacenado como string o JSONB
        this.contenido = contenido;
        this.publico = publico;
        this.creadoPor = creado_por;
        this.creadoEn = creado_en;
    }

    static fromJson(json) {
        try {
            return new Manual(json);
        } catch (error) {
            logRed(`Error en Manual.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            id: this.id,
            titulo: this.titulo,
            descripcion: this.descripcion,
            contenido: this.contenido,
            publico: this.publico,
            creadoPor: this.creadoPor,
            creadoEn: this.creadoEn,
        };
    }
}

export default Manual;
