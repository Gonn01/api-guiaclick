
export async function getManualById(id) {
    try {
        const query = "SELECT * FROM manuales WHERE id = $1";
        const results = await executeQuery(query, [id]);
        if (results.length === 0) throw new Error("Manual no encontrado");
        return Manual.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en ManualController.getManualById: ${error.stack}`);
        throw error;
    }
}