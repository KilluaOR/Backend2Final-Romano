import { Router } from "express";
import passport from "passport";
import rateLimit from "express-rate-limit";
import {
  registerCallback,
  loginCallback,
  currentCallback,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/sessions.controller.js";

const router = Router();

const mailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3, // Máximo 3 intentos de recuperación por IP
  message: "Demasiados intentos de correo, intente más tarde.",
});

const passportCall = (strategy) => {
  return (req, res, next) => {
    console.log(`Ejecutando estrategia: ${strategy}`);
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      console.log("Resultado Passport:", {
        err,
        user: user ? "Encontrado" : "No encontrado",
        info,
      });
      if (strategy === "register")
        return registerCallback(req, res, err, user, info);
      if (strategy === "login") return loginCallback(req, res, err, user, info);
      if (strategy === "current")
        return currentCallback(req, res, err, user, info);
      next();
    })(req, res, next);
  };
};

// Rutas de Autenticación
router.post("/register", passportCall("register"));
router.post("/login", passportCall("login"));
router.get("/current", passportCall("current"));

// Rutas de sesión y recuperación
router.post("/logout", logout);
router.post("/forgot-password", mailLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
