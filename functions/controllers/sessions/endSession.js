
export async function terminarSesion(id) {
    try {
        const query = "DELETE FROM sesiones WHERE id = $1";
        await executeQuery(query, [id]);
        return { id, terminated: true };
    } catch (error) {
        logRed(`Error en SesionController.terminarSesion: ${error.stack}`);
        throw error;
    }
}