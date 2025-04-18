// models/Rating.js
import { logRed } from "../funciones/logsCustom.js";

class Rating {
    constructor({ id, user_id, manual_id, score, comment, date }) {
        this.id = id;
        this.userId = user_id;
        this.manualId = manual_id;
        this.score = score;
        this.comment = comment;
        this.date = date;
    }

    static fromJson(json) {
        try {
            return new Rating(json);
        } catch (error) {
            logRed(`Error in Rating.fromJson: ${error.stack}`);
            throw error;
        }
    }

    toJson() {
        return {
            id: this.id,
            user_id: this.userId,
            manual_id: this.manualId,
            score: this.score,
            comment: this.comment,
            date: this.date,
        };
    }
}

export default Rating;
