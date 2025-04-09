
export async function quitarManualDeEmpresa(empresaId, manualId) {
    try {
        const query =
            "DELETE FROM manual_empresa WHERE empresa_id = $1 AND manual_id = $2";
        await executeQuery(query, [empresaId, manualId]);
        return { empresaId, manualId, deleted: true };
    } catch (error) {
        logRed(`Error en ManualEmpresaController.quitarManualDeEmpresa: ${error.stack}`);
        throw error;
    }
}