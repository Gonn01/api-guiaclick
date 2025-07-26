
import { executeQuery } from '../../db.js';
import { logRed } from '../../funciones/logsCustom.js';

export async function listManuales() {
    try {
        const query = `
      SELECT
        m.id,
        m.title,
        m.description,
        m.image,
        m.public,
        m.company_id,
        u.name AS author,
        m.created_at,
        COUNT(DISTINCT s.id) AS step_count,
        COUNT(DISTINCT f.user_id) AS favorites_count
      FROM manuals m
      LEFT JOIN users u
        ON m.created_by = u.id
      LEFT JOIN steps s
        ON m.id = s.manual_id
      LEFT JOIN favorites f
        ON m.id = f.manual_id
      GROUP BY
        m.id, u.name
      ORDER BY
        m.created_at DESC
    `;
        const results = await executeQuery(query, [], true);

        // Si seguís usando Manual.fromJson, ajustá tu modelo para que acepte step_count y favorites_count
        return results.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            image: row.image,
            public: row.public,
            company_id: row.company_id,
            author: row.author,
            created_at: row.created_at,
            step_count: Number(row.step_count),
            favorites_count: Number(row.favorites_count)
        }));
    } catch (error) {
        logRed(`Error en ManualController.listManuales: ${error.stack}`);
        throw error;
    }
}
