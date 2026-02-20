import { userService } from "../services/user.service.js";

// --- Obtener todos los usuarios ---
export const getAll = async (req, res) => {
  try {
    const users = await userService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

// --- Obtener por ID ---
export const getById = async (req, res) => {
  try {
    const { uid } = req.params;
    const isSelf = req.user?._id?.toString() === uid;
    const isAdmin = req.user?.role === "admin";

    if (!isSelf && !isAdmin) {
      return res.status(403).send({ status: "error", message: "Forbidden" });
    }

    const user = await userService.getByIdSafe(uid);
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    }
    res.send({ status: "success", payload: user });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

// --- Actualizar usuario ---
export const update = async (req, res) => {
  try {
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

    // Validación de edad
    if (age !== undefined) {
      const parsedAge = Number(age);
      if (!isNaN(parsedAge)) updateData.age = parsedAge;
    }

    if (isAdmin && typeof role === "string") updateData.role = role;

    const updated = await userService.update(uid, updateData);
    if (!updated) {
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    }
    res.send({ status: "success", payload: updated });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

// --- Eliminar usuario ---
export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const result = await userService.delete(uid);
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    }
    res.send({ status: "success" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};
