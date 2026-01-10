import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { AppError } from "../utils/app_error.js";
import { Roles, normalizeRole } from "../constants/roles.js";

export class AuthService {
  constructor({ usersRepository }) {
    this.usersRepository = usersRepository;
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new AppError({ message: "Email and password are required", statusCode: 400 });
    }

    const user = await this.usersRepository.findByEmailWithCompany(email);
    if (!user) {
      throw new AppError({ message: "User not found", statusCode: 404 });
    }

    const isValid = await bcrypt.compare(String(password), String(user.password));
    if (!isValid) {
      throw new AppError({ message: "Invalid credentials", statusCode: 401 });
    }

    if (typeof JWT_SECRET !== "string" || JWT_SECRET.trim() === "") {
      throw new AppError({ message: "JWT_SECRET is invalid or undefined", statusCode: 500 });
    }

    const role = normalizeRole(user.role);

    const token = jwt.sign(
      {
        userId: user.id,
        role: role ?? Roles.USER,
        company_id: user.company_id || null,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      role: role ?? Roles.USER,
      company_id: user.company_id || null,
      company_name: user.company_name || null,
    };
  }

  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new AppError({ message: "Name, email, password are required", statusCode: 400 });
    }

    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
    if (!nameRegex.test(name)) {
      throw new AppError({ message: "Invalid name format", statusCode: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError({ message: "Invalid email format", statusCode: 400 });
    }

    const exists = await this.usersRepository.existsByEmail(email);
    if (exists) {
      throw new AppError({ message: "User already registered", statusCode: 409 });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const newUser = await this.usersRepository.createUser({
      name,
      email,
      passwordHash,
      role: Roles.USER,
      company_id: null,
    });

    return newUser;
  }
}
