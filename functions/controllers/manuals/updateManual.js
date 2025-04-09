
export async function updateManual(id, data) {
    try {
        let fields = [];
        let values = [];
        let i = 1;
        if (data.titulo !== undefined) {
            fields.push(`titulo = $${i}`);
            values.push(data.titulo);
            i++;
        }
        if (data.descripcion !== undefined) {
            fields.push(`descripcion = $${i}`);
            values.push(data.descripcion);
            i++;
        }
        if (data.contenido !== undefined) {
            fields.push(`contenido = $${i}`);
            values.push(JSON.stringify(data.contenido));
            i++;
        }
        if (data.publico !== undefined) {
            fields.push(`publico = $${i}`);
            values.push(data.publico);
            i++;
        }
        if (fields.length === 0)
            throw new Error("No hay campos para actualizar");
        const query = `UPDATE manuales SET ${fields.join(
            ", "
        )} WHERE id = $${i} RETURNING *`;
        values.push(id);
        const results = await executeQuery(query, values);
        if (results.length === 0)
            throw new Error("No se pudo actualizar el manual");
        return Manual.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en ManualController.updateManual: ${error.stack}`);
        throw error;
    }
}