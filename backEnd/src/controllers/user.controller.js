import { userRepository } from "../repositories/user.repository.js";

export async function getAll(req, res) {
  const users = await userRepository.getAll();
  res.send({ status: "success", payload: users });
}

export async function getById(req, res) {
  const { uid } = req.params;
  const isSelf = req.user?._id?.toString() === uid;
  const isAdmin = req.user?.role === "admin";

  if (!isSelf && !isAdmin) {
    return res.status(403).send({ status: "error", message: "Forbidden" });
  }

  const user = await userRepository.getByIdSafe(uid);
  if (!user) {
    return res.status(404).send({ status: "error", message: "User not found" });
  }
  res.send({ status: "success", payload: user });
}

export async function update(req, res) {
  const { uid } = req.params;
  const isSelf = req.user?._id?.toString() === uid;
  const isAdmin = req.user?.role === "admin";

  if (!isSelf && !isAdmin) {
    return res.status(403).send({ status: "error", message: "Forbidden" });
  }

  const { first_name, last_name, age, role } = req.body;
  const updateData = {};
  if (typeof first_name === "string") updateData.first_name = first_name;
  if (typeof last_name === "string") updateData.last_name = last_name;
  if (typeof age !== "undefined") updateData.age = Number(age);
  if (isAdmin && typeof role === "string") updateData.role = role;

  const updated = await userRepository.update(uid, updateData);
  if (!updated) {
    return res.status(404).send({ status: "error", message: "User not found" });
  }
  res.send({ status: "success", payload: updated });
}

export async function deleteUser(req, res) {
  const { uid } = req.params;
  const result = await userRepository.delete(uid);
  if (result.deletedCount === 0) {
    return res.status(404).send({ status: "error", message: "User not found" });
  }
  res.send({ status: "success" });
}
