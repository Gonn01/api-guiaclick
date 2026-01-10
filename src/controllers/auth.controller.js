export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    const { email, password } = req.body;
    const body = await this.authService.login({ email, password });
    return res.status(200).json({ message: "Login successful", body });
  };

  register = async (req, res) => {
    const { name, email, password } = req.body;
    const body = await this.authService.register({ name, email, password });
    return res.status(201).json({ message: "User registered successfully", body });
  };
}
