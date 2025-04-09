
export async function createManual(titulo, descripcion, contenido, creadoPor) {
    try {
        const query =
            "INSERT INTO manuales (titulo, descripcion, contenido, creado_por) VALUES ($1, $2, $3, $4) RETURNING *";
        const results = await executeQuery(query, [
            titulo,
            descripcion,
            JSON.stringify(contenido),
            creadoPor,
        ]);
        return Manual.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en ManualController.createManual: ${error.stack}`);
        throw error;
    }
}
