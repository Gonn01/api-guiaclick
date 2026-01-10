import { logRed, logPurple } from "../utils/logs_custom.js";
import { performance } from "perf_hooks";

export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  list = async (req, res) => {
    const start = performance.now();
    try {
      const body = await this.usersService.listUsers();
      return res.status(200).json({ body, message: "Usuarios listados correctamente." });
    } catch (err) {
      logRed(`Error en GET /api/usuarios: ${err.stack || err.message}`);
      return res.status(500).json({ message: err.message });
    } finally {
      logPurple(`GET /api/usuarios - ${performance.now() - start}ms`);
    }
  };

  delete = async (req, res) => {
    const start = performance.now();
    try {
      const { id } = req.params;
      await this.usersService.deleteUser(id);
      return res.status(200).json({ message: "Usuario y sus datos eliminados correctamente." });
    } catch (err) {
      logRed(`Error en DELETE /api/usuarios/:id: ${err.stack || err.message}`);
      return res.status(500).json({ message: "Error al eliminar el usuario y sus datos." });
    } finally {
      logPurple(`DELETE /api/usuarios/:id - ${performance.now() - start}ms`);
    }
  };

  linkCompanyByCode = async (req, res) => {
    const start = performance.now();
    try {
      const { userId } = req.params;
      const { code } = req.body;
      const company_id = await this.usersService.linkUserToCompanyByCode({ userId, code });
      return res.status(200).json({ message: "Usuario vinculado correctamente a la empresa.", company_id });
    } catch (err) {
      logRed(`Error en POST /api/users/:userId/company: ${err.stack || err.message}`);
      return res.status(err.statusCode || 500).json({ message: err.message });
    } finally {
      logPurple(`POST /api/users/:userId/company - ${performance.now() - start}ms`);
    }
  };
}
