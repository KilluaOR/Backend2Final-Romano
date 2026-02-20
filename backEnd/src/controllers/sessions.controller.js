import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/passport.config.js";
import { toUserCurrentDTO } from "../dto/user.dto.js";
import { userService } from "../services/user.service.js";

// --- Registro ---
export const registerCallback = (req, res, err, user, info) => {
  if (err || !user) {
    console.error("Register error:", err);
    return res.status(400).json({
      status: "error",
      message: info?.message || err?.message || "Error al registrar",
    });
  }

  res.status(201).send({
    status: "success",
    message: "Usuario registrado correctamente",
    payload: toUserCurrentDTO(user),
  });
};

// --- Login ---
export const loginCallback = (req, res, err, user, info) => {
  console.log("Datos recibidos en el login:", req.body);
  if (err || !user) {
    return res.status(401).json({
      status: "error",
      message: info?.message || "Credenciales inválidas",
    });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, cart: user.cart },
    jwtSecret,
    { expiresIn: "1h" },
  );

  const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    signed: !!process.env.COOKIE_SECRET,
  };

  res.cookie("jwtCookie", token, cookieOptions).send({
    status: "success",
    message: "Login exitoso",
    payload: toUserCurrentDTO(user),
  });
};

// --- Current User ---
export const currentCallback = (req, res, err, user, info) => {
  if (err || !user) {
    return res.status(401).json({
      status: "error",
      message: info?.message || "Sesión expirada. Inicie sesión nuevamente.",
    });
  }

  res.send({
    status: "success",
    payload: toUserCurrentDTO(user),
  });
};

// --- Logout ---
export const logout = (req, res) => {
  res
    .clearCookie("jwtCookie", {
      httpOnly: true,
      signed: !!process.env.COOKIE_SECRET,
    })
    .redirect("/login");
};

// --- Password Reset ---
export const forgotPassword = async (req, res) => {
  try {
    await userService.requestPasswordReset(req.body.email);
    res.status(200).json({
      status: "success",
      message:
        "Si el email existe, recibirás un enlace para restablecer la contraseña.",
    });
  } catch (error) {
    res.status(200).json({
      status: "success",
      message:
        "Si el email existe, recibirás un enlace para restablecer la contraseña.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      throw new Error("Token y contraseña son requeridos");

    await userService.resetPassword(token, password);

    res.send({
      status: "success",
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};
