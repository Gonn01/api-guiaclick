
export async function deleteManual(id) {
    try {
        const query = "DELETE FROM manuales WHERE id = $1";
        await executeQuery(query, [id]);
        return { id, deleted: true };
    } catch (error) {
        logRed(`Error en ManualController.deleteManual: ${error.stack}`);
        throw error;
    }
}