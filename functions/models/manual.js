// models/Manual.js
import { logRed } from "../funciones/logsCustom.js";

export class Manual {
    constructor({ id, title, description, public: isPublic, created_by, created_at }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.public = isPublic;
        this.createdBy = created_by;
        this.createdAt = created_at;
    }

    static fromJson(json) {
        try {
            return new Manual(json);
        } catch (error) {
            logRed(`Error in Manual.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            public: this.public,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
        };
    }
}

export default Manual;
