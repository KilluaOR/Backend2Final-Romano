import { userDAO } from "../dao/userDBManager.js";
import { createHash } from "../utils/bcryptUtil.js";
import { cartRepository } from "./cart.repository.js";
import crypto from "crypto";

export const userRepository = {
  async getById(id) {
    return userDAO.findById(id);
  },

  async getByIdSafe(id) {
    return userDAO.findByIdSafe(id);
  },

  async getAll() {
    return userDAO.findAll();
  },

  async update(uid, data) {
    return userDAO.update(uid, data);
  },

  async delete(uid) {
    return userDAO.delete(uid);
  },

  async getByEmail(email) {
    return userDAO.findByEmail(email);
  },

  // Registro: valida edad, que el email no exista, crea carrito, crea usuario con contraseña hasheada.
  async register({ first_name, last_name, email, age, password }) {
    const ageNum = age !== undefined && age !== "" ? Number(age) : NaN;
    if (!Number.isInteger(ageNum) || ageNum < 0) {
      return {
        success: false,
        message: "Edad inválida (debe ser un número entero >= 0)",
      };
    }

    const existing = await userDAO.findByEmail(email);
    if (existing) {
      return { success: false, message: "El usuario ya existe" };
    }

    const cart = await cartRepository.createCart();
    const hashedPassword = createHash(password);
    const user = await userDAO.create({
      first_name: first_name?.trim(),
      last_name: last_name?.trim(),
      email: email?.trim().toLowerCase(),
      age: ageNum,
      password: hashedPassword,
      cart: cart._id,
    });
    return { success: true, user };
  },

  async requestPasswordReset(email) {
    const user = await userDAO.findByEmail(email);
    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await userDAO.setResetToken(user.email, token, expiresAt);
    // TODO: enviar email con link de reset (crear utils/mailer.js y BASE_URL)
    return {
      success: true,
      message:
        "Si el email existe, recibirás un enlace para restablecer la contraseña",
    };
  },

  async resetPassword(token, newPassword) {
    const user = await userDAO.findByResetToken(token);
    if (!user) {
      return { success: false, message: "Token inválido o expirado" };
    }
    if (createHash(newPassword) === user.password) {
      return { success: false, message: "No puedes usar la misma contraseña" };
    }
    const hashedPassword = createHash(newPassword);
    await userDAO.updatePassword(user._id, hashedPassword);
    return { success: true, message: "Contraseña actualizada" };
  },
};
