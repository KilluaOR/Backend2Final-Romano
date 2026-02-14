import { userService } from "./user.service.js";

export const sessionsService = {
  getByEmail(email) {
    return userService.getByEmail(email);
  },
  register(data) {
    return userService.register(data);
  },
  requestPasswordReset(email) {
    return userService.requestPasswordReset(email);
  },
  resetPassword(token, newPassword) {
    return userService.resetPassword(token, newPassword);
  },
};
