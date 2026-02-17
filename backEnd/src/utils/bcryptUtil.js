import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));

export const isValidPassword = (user, plainPassword) =>
  bcrypt.compareSync(plainPassword, user.password);
