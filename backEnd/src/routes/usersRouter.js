import { Router } from "express";
import passport from "passport";
import { requireAdmin } from "../middlewares/authorization.middleware.js";
import {
  getAll,
  getById,
  update,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();
const passportJWT = passport.authenticate("jwt", { session: false });

router.get("/", passportJWT, requireAdmin, getAll);
router.get("/:uid", passportJWT, getById);
router.put("/:uid", passportJWT, update);
router.delete("/:uid", passportJWT, requireAdmin, deleteUser);

export default router;
