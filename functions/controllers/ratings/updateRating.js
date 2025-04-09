
export async function actualizarValoracion(id, data) {
    try {
        let fields = [];
        let values = [];
        let i = 1;
        if (data.puntuacion !== undefined) {
            fields.push(`puntuacion = $${i}`);
            values.push(data.puntuacion);
            i++;
        }
        if (data.comentario !== undefined) {
            fields.push(`comentario = $${i}`);
            values.push(data.comentario);
            i++;
        }
        if (fields.length === 0)
            throw new Error("No hay campos para actualizar");
        const query = `UPDATE valoraciones SET ${fields.join(
            ", "
        )} WHERE id = $${i} RETURNING *`;
        values.push(id);
        const results = await executeQuery(query, values);
        if (results.length === 0)
            throw new Error("No se pudo actualizar la valoración");
        return Valoracion.fromJson(results[0]).toJson();
    } catch (error) {
        logRed(`Error en ValoracionController.actualizarValoracion: ${error.stack}`);
        throw error;
    }
}