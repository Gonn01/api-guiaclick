
export async function asignarManualAEmpresa(empresaId, manualId) {
    try {
        const query =
            "INSERT INTO manual_empresa (manual_id, empresa_id) VALUES ($1, $2) RETURNING *";
        const results = await executeQuery(query, [manualId, empresaId]);
        return results[0]; // O, si lo deseás, transformalo a una instancia de un modelo específico
    } catch (error) {
        logRed(`Error en ManualEmpresaController.asignarManualAEmpresa: ${error.stack}`);
        throw error;
    }
}