import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/passport.config.js";

const router = Router();

// Registro de usuario (con manejo de errores para ver fallos de validación/DB)
router.post("/register", (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Register error:", err);
      const message =
        err.code === 11000
          ? "El email ya está registrado"
          : err.message || "Error al registrar";
      return res.status(500).json({ status: "error", message });
    }
    if (!user) {
      return res
        .status(400)
        .json({
          status: "error",
          message: info?.message || "No se pudo crear el usuario",
        });
    }
    console.log(
      "Usuario registrado en la BD:",
      user.email,
      "| id:",
      user._id.toString(),
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
  })(req, res, next);
});

// Login de usuario con generación de JWT en cookie httpOnly (respuesta JSON en error)
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({
          status: "error",
          message: err.message || "Error al iniciar sesión",
        });
    }
    if (!user) {
      return res
        .status(401)
        .json({
          status: "error",
          message: info?.message || "Credenciales inválidas",
        });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "1h" },
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
  })(req, res, next);
});

// Endpoint current: valida JWT y devuelve datos del usuario (error JSON si token inválido/inexistente)
router.get("/current", (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({
          status: "error",
          message: err.message || "Error de autenticación",
        });
    }
    if (!user) {
      return res.status(401).json({
        status: "error",
        message:
          info?.message ||
          "Token inválido o expirado. Iniciá sesión nuevamente.",
      });
    }
    res.send({
      status: "success",
      payload: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart,
      },
    });
  })(req, res, next);
});

// Cerrar sesión: borra la cookie y redirige al formulario de login
router.post("/logout", (req, res) => {
  res
    .clearCookie("jwtCookie", {
      httpOnly: true,
      signed: !!process.env.COOKIE_SECRET,
    })
    .redirect("/login");
});

export default router;
