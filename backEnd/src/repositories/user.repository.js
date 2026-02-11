import { userDAO } from '../dao/userDBManager.js';
import { createHash } from '../utils/bcryptUtil.js';
import { cartRepository } from './cart.repository.js';

/**
 * Repository de usuarios. Orquesta UserDAO y CartRepository.
 * register = crear carrito + crear usuario (lógica de negocio).
 */
export const userRepository = {
  async getById(id) {
    return userDAO.findById(id);
  },

  /** Para API: usuario sin password */
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

  /**
   * Registro: valida edad, que el email no exista, crea carrito, crea usuario con contraseña hasheada.
   */
  async register({ first_name, last_name, email, age, password }) {
    const ageNum = age !== undefined && age !== '' ? Number(age) : NaN;
    if (!Number.isInteger(ageNum) || ageNum < 0) {
      return { success: false, message: 'Edad inválida (debe ser un número entero >= 0)' };
    }

    const existing = await userDAO.findByEmail(email);
    if (existing) {
      return { success: false, message: 'El usuario ya existe' };
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
};
