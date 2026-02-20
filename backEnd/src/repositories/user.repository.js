import { userDAO } from "../dao/userDBManager.js";
import { mailingService } from "../services/mailing.service.js";
import { createHash, isValidPassword } from "../utils/bcryptUtil.js";
import { cartRepository } from "./cart.repository.js";
import crypto from "crypto";

export const userRepository = {
  getById: async (id) => userDAO.findById(id),
  getByIdSafe: async (id) => userDAO.findByIdSafe(id),
  getAll: async () => userDAO.findAll(),
  update: async (uid, data) => userDAO.update(uid, data),
  delete: async (uid) => userDAO.delete(uid),
  getByEmail: async (email) => userDAO.findByEmail(email),

  // Registro: valida edad, que el email no exista, crea carrito, crea usuario con contraseña hasheada.
  register: async ({ first_name, last_name, email, age, password }) => {
    const ageNum = age !== undefined && age !== "" ? Number(age) : NaN;
    if (!Number.isInteger(ageNum) || ageNum < 0) {
      return {
        success: false,
        message: "Edad inválida",
      };
    }

    const existing = await userDAO.findByEmail(email);
    if (existing) return { success: false, message: "El usuario ya existe" };

    const cart = await cartRepository.createCart();
    const user = await userDAO.create({
      first_name: first_name?.trim(),
      last_name: last_name?.trim(),
      email: email?.trim().toLowerCase(),
      age: ageNum,
      password: createHash(password),
      cart: cart._id,
    });
    return { success: true, user };
  },

  requestPasswordReset: async (email) => {
    const user = await userDAO.findByEmail(email);
    if (!user) return { success: false, message: "Usuario no encontrado" };
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await userDAO.setResetToken(user.email, token, expiresAt);

    await mailingService.sendMail({
      to: user.email,
      subject: "Restablecer contraseña",
      html: `<h1> Usa este token para resetear tu clave:</h1><p]>${token}</p>`,
    });
    return {
      success: true,
      message: "Enlace enviado",
    };
  },

  resetPassword: async (token, newPassword) => {
    const user = await userDAO.findByResetToken(token);

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new Error("El token es inválido o ha expirado");
    }

    if (isValidPassword(user, newPassword)) {
      throw new Error("No puedes usar la misma contraseña anterior");
    }

    const hashedPassword = createHash(newPassword);
    await userDAO.updatePassword(user._id, hashedPassword);

    await userDAO.setResetToken(user.email, null, null);

    return { success: true };
  },
};
