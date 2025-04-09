// models/Usuario.js
import { logRed } from "../funciones/logsCustom.js";

export default class Usuario {
    constructor(id, nombre, email, tipoUsuario, passwordHash, creadoEn) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.tipoUsuario = tipoUsuario;
        this.passwordHash = passwordHash;
        this.creadoEn = creadoEn;
    }
    static fromJson(json) {
        return new Usuario(json.id, json.nombre, json.email, json.tipo_usuario, json.password_hash, json.creado_en);
    }
    toJson() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            tipo_usuario: this.tipoUsuario,
            creado_en: this.creadoEn
        };
    }
}