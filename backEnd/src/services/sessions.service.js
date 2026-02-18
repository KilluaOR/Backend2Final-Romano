import { userService } from "./user.service.js";

export const sessionsService = {
  // Para el login: buscamos al usuario por email
  login: async (email) => {
    return await userService.getByEmail(email);
  },

  // Para el registro: delegamos la creación
  register: async (userData) => {
    return await userService.register(userData);
  },

  // Lógica de recuperación de contraseña
  requestPasswordReset: async (email) => {
    return await userService.requestPasswordReset(email);
  },

  resetPassword: async (token, newPassword) => {
    return await userService.resetPassword(token, newPassword);
  },

  // Método extra que podrías necesitar para el "current"
  getCurrentUser: async (id) => {
    return await userService.getByIdSafe(id);
  },
};
