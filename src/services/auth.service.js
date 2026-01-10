import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export class AuthService {
  constructor({ usersRepository }) {
    this.usersRepository = usersRepository;
  }

  async login({ email, password }) {
    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.statusCode = 400;
      throw err;
    }

    const user = await this.usersRepository.findByEmailWithCompany(email);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    const isValid = await bcrypt.compare(String(password), String(user.password));
    if (!isValid) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    if (typeof JWT_SECRET !== "string" || JWT_SECRET.trim() === "") {
      const err = new Error("JWT_SECRET is invalid or undefined");
      err.statusCode = 500;
      throw err;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
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
      role: Number(user.role),
      company_id: user.company_id || null,
      company_name: user.company_name || null,
    };
  }

  async register({ name, email, password }) {
    if (!name || !email || !password) {
      const err = new Error("Name, email, password are required");
      err.statusCode = 400;
      throw err;
    }

    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
    if (!nameRegex.test(name)) {
      const err = new Error("Invalid name format");
      err.statusCode = 400;
      throw err;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const err = new Error("Invalid email format");
      err.statusCode = 400;
      throw err;
    }

    const exists = await this.usersRepository.existsByEmail(email);
    if (exists) {
      const err = new Error("User already registered");
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const newUser = await this.usersRepository.createUser({
      name,
      email,
      passwordHash,
      role: 0,
      company_id: null,
    });

    return newUser;
  }
}
