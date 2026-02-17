import { userModel } from "./models/userModel.js";

export const UserDAO = {
  findById: async (id) => {
    const user = await userModel.findById(id);
    return user ?? null;
  },

  findByEmail: async (email) => {
    const user = await userModel.findOne({
      email: email?.trim().toLowerCase(),
    });
    return user ?? null;
  },

  create: async (data) => userModel.create(data),

  findByIdSafe: async (id) => {
    return (await userModel.findById(id).select("-password").lean()) ?? null;
  },

  findAll: async () => {
    return await userModel.find().select("-password").lean();
  },

  update: async (id, data) => {
    return (
      (await userModel
        .findByIdAndUpdate(id, data, { new: true })
        .select("-password")
        .lean()) ?? null
    );
  },

  delete: async (id) => {
    userModel.deleteOne({ _id: id });
  },

  setResetToken: async (email, token, expiresAt) => {
    const user = await userDAO.findByEmail(email);
    if (!user) return null;
    return (
      await userModel.findByIdAndUpdate(user._id, {
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt,
      }),
      { new: true }
    );
  },

  findByResetToken: async (token) => {
    return (
      (await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      })) ?? null
    );
  },

  updatePassword: async (userId, hashedPassword) => {
    return (
      (await userModel.findByIdAndUpdate(
        userId,
        {
          password: hashedPassword,
          $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
        },
        { new: true },
      )) ?? null
    );
  },
};
