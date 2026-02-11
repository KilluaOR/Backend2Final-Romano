import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/passport.config.js";
import { toUserCurrentDTO } from "../dto/user.dto.js";

export function registerCallback(req, res, err, user, info) {
  if (err) {
    console.error("Register error:", err);
    const message =
      err.code === 11000
        ? "El email ya está registrado"
        : err.message || "Error al registrar";
    return res.status(500).json({ status: "error", message });
  }
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: info?.message || "No se pudo crear el usuario",
    });
  }
  console.log(
    "Usuario registrado en la BD:",
    user.email,
    "| id:",
    user._id.toString()
  );
  res.status(201).send({
    status: "success",
    message: "Usuario registrado correctamente",
    payload: {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
    },
  });
}

export function loginCallback(req, res, err, user, info) {
  if (err) {
    return res.status(500).json({
      status: "error",
      message: err.message || "Error al iniciar sesión",
    });
  }
  if (!user) {
    return res.status(401).json({
      status: "error",
      message: info?.message || "Credenciales inválidas",
    });
  }
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: "1h" }
  );
  const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  };
  if (process.env.COOKIE_SECRET) {
    cookieOptions.signed = true;
  }
  res
    .cookie("jwtCookie", token, cookieOptions)
    .send({ status: "success", message: "Login exitoso" });
}

export function currentCallback(req, res, err, user, info) {
  if (err) {
    return res.status(500).json({
      status: "error",
      message: err.message || "Error de autenticación",
    });
  }
  if (!user) {
    return res.status(401).json({
      status: "error",
      message:
        info?.message || "Token inválido o expirado. Iniciá sesión nuevamente.",
    });
  }
  res.send({
    status: "success",
    payload: toUserCurrentDTO(user),
  });
}

export function logout(req, res) {
  res
    .clearCookie("jwtCookie", {
      httpOnly: true,
      signed: !!process.env.COOKIE_SECRET,
    })
    .redirect("/login");
}
