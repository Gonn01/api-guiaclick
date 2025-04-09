// models/Categoria.js
import { logRed } from "../funciones/logsCustom.js";

class Category {
    constructor({ id, nombre }) {
        this.id = id;
        this.nombre = nombre;
    }

    static fromJson(json) {
        try {
            return new Category(json);
        } catch (error) {
            logRed(`Error en Categoria.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            id: this.id,
            nombre: this.nombre,
        };
    }
}

export default Category;
