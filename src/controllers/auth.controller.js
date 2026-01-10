import { logRed } from "../utils/logs_custom.js";

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const body = await this.authService.login({ email, password });
      return res.status(200).json({ message: "Login successful", body });
    } catch (err) {
      logRed(`Login error: ${err.stack || err.message}`);
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };

  register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const body = await this.authService.register({ name, email, password });
      return res.status(201).json({ message: "User registered successfully", body });
    } catch (err) {
      logRed(`Register error: ${err.stack || err.message}`);
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
  };
}
