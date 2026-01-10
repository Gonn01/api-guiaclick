import { AppError } from "../utils/app_error.js";

export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  list = async (_req, res) => {
    const body = await this.usersService.listUsers();
    return res.status(200).json({ body, message: "Usuarios listados correctamente." });
  };

  delete = async (req, res) => {
    const { id } = req.params;
    if (!id) throw new AppError({ message: "Falta el parámetro: id", statusCode: 400 });
    await this.usersService.deleteUser(id);
    return res.status(200).json({ message: "Usuario y sus datos eliminados correctamente." });
  };

  linkCompanyByCode = async (req, res) => {
    const { userId } = req.params;
    const { code } = req.body;
    if (!userId) throw new AppError({ message: "Falta el parámetro: userId", statusCode: 400 });
    const company_id = await this.usersService.linkUserToCompanyByCode({ userId, code });
    return res.status(200).json({ message: "Usuario vinculado correctamente a la empresa.", company_id });
  };
}
