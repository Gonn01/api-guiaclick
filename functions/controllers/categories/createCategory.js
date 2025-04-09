
export async function createCategoria(nombre) {
    try {
        const query = "INSERT INTO categorias (nombre) VALUES ($1) RETURNING *";
        const results = await executeQuery(query, [nombre]);
        return Categoria.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en CategoriaController.createCategoria: ${error.stack}`);
        throw error;
    }
}