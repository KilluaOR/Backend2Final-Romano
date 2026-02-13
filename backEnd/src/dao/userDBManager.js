import { userModel } from "./models/userModel.js";

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

  async create(data) {
    const user = await userModel.create(data);
    return user;
  }

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

  async setResetToken(email, token, expiresAt) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    await userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: expiresAt,
    });
    return user;
  }

  async findByResetToken(token) {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    return user ?? null;
  }

  async updatePassword(userId, hashedPassword) {
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        $unset: { resetPAsswordToken: "", resetPasswordExpires: "" },
      },
      { new: true },
    );
    return user ?? null;
  }
}

const userDAO = new UserDAO();
export { UserDAO, userDAO };
