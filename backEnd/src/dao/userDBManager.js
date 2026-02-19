import { userModel } from "./models/userModel.js";

export const userDAO = {
  findById: async (id) => {
    return await userModel.findById(id);
  },

  findByEmail: async (email) => {
    return await userModel.findOne({
      email: email?.trim().toLowerCase(),
    });
  },

  create: async (data) => userModel.create(data),

  findByIdSafe: async (id) => {
    return await userModel.findById(id).select("-password").lean();
  },

  findAll: async () => {
    return await userModel.find().select("-password").lean();
  },

  update: async (id, data) => {
    return await userModel
      .findByIdAndUpdate(id, data, { new: true })
      .select("-password")
      .lean();
  },

  delete: async (id) => {
    return await userModel.deleteOne({ _id: id });
  },

  setResetToken: async (email, token, expiresAt) => {
    return await userModel.findOneAndUpdate(
      { email: email?.trim().toLowerCase() },
      {
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt,
      },
      { new: true },
    );
  },

  findByResetToken: async (token) => {
    return await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
  },

  updatePassword: async (userId, hashedPassword) => {
    return await userModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
      },
      { new: true },
    );
  },
};
