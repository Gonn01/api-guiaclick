
export async function listarFeedback() {
    try {
        const query = "SELECT * FROM feedback ORDER BY fecha DESC";
        const results = await executeQuery(query);
        return results.map(Feedback.fromJson).map(f => f.toJson());
    } catch (error) {
        logRed(`Error en FeedbackController.listarFeedback: ${error.stack}`);
        throw error;
    }
}
