import { userService } from "./user.service.js";

export const sessionsService = {
  login: async (email) => {
    return await userService.getByEmail(email.toLowerCase());
  },

  register: async (userData) => {
    return await userService.register(userData);
  },

  requestPasswordReset: async (email) => {
    return await userService.requestPasswordReset(email);
  },

  resetPassword: async (token, newPassword) => {
    return await userService.resetPassword(token, newPassword);
  },

  getCurrentUser: async (id) => {
    return await userService.getByIdSafe(id);
  },
};
