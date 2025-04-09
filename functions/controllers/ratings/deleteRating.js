
export async function eliminarValoracion(id) {
    try {
        const query = "DELETE FROM valoraciones WHERE id = $1";
        await executeQuery(query, [id]);
        return { id, deleted: true };
    } catch (error) {
        logRed(`Error en ValoracionController.eliminarValoracion: ${error.stack}`);
        throw error;
    }
}