import { Router } from "express";
import passport from "passport";
import {
  registerCallback,
  loginCallback,
  currentCallback,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/sessions.controller.js";

const router = Router();

const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
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
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
