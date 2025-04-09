
export async function searchManuales(queryParam) {
    try {
        const query = `
        SELECT * FROM manuales
        WHERE titulo ILIKE $1 OR descripcion ILIKE $1
      `;
        const value = `%${queryParam}%`;
        const results = await executeQuery(query, [value]);
        return results.map(Manual.fromJson).map(m => m.toJson());
    } catch (error) {
        logRed(`Error en ManualController.searchManuales: ${error.stack}`);
        throw error;
    }
}