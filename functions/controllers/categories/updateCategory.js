
export async function updateCategoria(id, nombre) {
    try {
        const query = "UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *";
        const results = await executeQuery(query, [nombre, id]);
        if (results.length === 0)
            throw new Error("No se pudo actualizar la categoría");
        return Categoria.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en CategoriaController.updateCategoria: ${error.stack}`);
        throw error;
    }
}