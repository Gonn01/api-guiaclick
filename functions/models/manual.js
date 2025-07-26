import { logRed } from "../funciones/logsCustom.js";

export class Manual {
    constructor({
        id = null,
        title = "",
        description = "",
        image = "",
        public: isPublic = true,
        created_by = null,
        created_at = null,
        company_id = null,
        company_name = null,
    } = {}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.public = isPublic;
        this.created_by = created_by;
        this.created_at = created_at;
        this.company_id = company_id;
        this.company_name = company_name;
    }

    static fromJson(json) {
        try {
            if (!json || typeof json !== "object") {
                throw new Error("Invalid JSON data for Manual");
            }
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
            image: this.image,
            public: this.public,
            created_by: this.created_by,
            created_at: this.created_at,
            company_id: this.company_id,
            company_name: this.company_name,
        };
    }
}

export default Manual;
