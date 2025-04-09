
export async function deleteCategoria(id) {
    try {
        const query = "DELETE FROM categorias WHERE id = $1";
        await executeQuery(query, [id]);
        return { id, deleted: true };
    } catch (error) {
        logRed(`Error en CategoriaController.deleteCategoria: ${error.stack}`);
        throw error;
    }
}