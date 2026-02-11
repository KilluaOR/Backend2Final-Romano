import { userModel } from "./models/userModel.js";

/**
 * DAO (Data Access Object) de usuarios.
 * Encapsula el acceso a la colección de usuarios en MongoDB.
 */
class UserDAO {
  async findById(id) {
    const user = await userModel.findById(id);
    return user ?? null;
  }

  async findByEmail(email) {
    const user = await userModel.findOne({
      email: email?.trim().toLowerCase(),
    });
    return user ?? null;
  }

  /**
   * Crea un usuario. No crea carrito (eso lo orquesta el Repository).
   * @param {Object} data - { first_name, last_name, email, age, password, cart }
   */
  async create(data) {
    const user = await userModel.create(data);
    return user;
  }

  /** Para respuestas API: usuario sin password */
  async findByIdSafe(id) {
    const user = await userModel.findById(id).select("-password").lean();
    return user ?? null;
  }

  async findAll() {
    return userModel.find().select("-password").lean();
  }

  async update(id, data) {
    const user = await userModel
      .findByIdAndUpdate(id, data, { new: true })
      .select("-password")
      .lean();
    return user ?? null;
  }

  async delete(id) {
    const result = await userModel.deleteOne({ _id: id });
    return result;
  }
}

const userDAO = new UserDAO();
export { UserDAO, userDAO };
