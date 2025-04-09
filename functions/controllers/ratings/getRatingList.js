
export async function listarValoracionesManual(manualId) {
    try {
        const query = "SELECT * FROM valoraciones WHERE manual_id = $1 ORDER BY fecha DESC";
        const results = await executeQuery(query, [manualId]);
        return results.map(Valoracion.fromJson).map(v => v.toJson());
    } catch (error) {
        logRed(`Error en ValoracionController.listarValoracionesManual: ${error.stack}`);
        throw error;
    }
}
