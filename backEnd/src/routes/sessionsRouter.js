import { Router } from "express";
import passport from "passport";
import {
  registerCallback,
  loginCallback,
  currentCallback,
  logout,
} from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    registerCallback(req, res, err, user, info);
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    loginCallback(req, res, err, user, info);
  })(req, res, next);
});

router.get("/current", (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user, info) => {
    currentCallback(req, res, err, user, info);
  })(req, res, next);
});

router.post("/logout", logout);

export default router;
