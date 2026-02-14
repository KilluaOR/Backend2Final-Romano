import { userRepository } from "../repositories/user.repository.js";

export const userService = {
  getById(id) {
    return userRepository.getById(id);
  },
  getByIdSafe(id) {
    return userRepository.getByIdSafe(id);
  },
  getAll() {
    return userRepository.getAll();
  },
  update(uid, data) {
    return userRepository.update(uid, data);
  },
  delete(uid) {
    return userRepository.delete(uid);
  },
  getByEmail(email) {
    return userRepository.getByEmail(email);
  },
  register(data) {
    return userRepository.register(data);
  },
  // requestPasswordReset(email) { return userRepository.requestPasswordReset(email); },
  // resetPassword(token, newPassword) { return userRepository.resetPassword(token, newPassword); },
};
