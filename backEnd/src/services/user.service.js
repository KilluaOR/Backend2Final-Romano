import { userRepository } from "../repositories/user.repository.js";

export const userService = {
  getById: (id) => userRepository.getById(id),
  getByIdSafe: (id) => userRepository.getByIdSafe(id),
  getAll: () => userRepository.getAll(),
  update: (uid, data) => userRepository.update(uid, data),
  delete: (uid) => userRepository.delete(uid),
  getByEmail: (email) => userRepository.getByEmail(email),
  register: (data) => userRepository.register(data),
  requestPasswordReset: (email) => userRepository.requestPasswordReset(email),
  resetPassword: (token, newPassword) =>
    userRepository.resetPassword(token, newPassword),
};
