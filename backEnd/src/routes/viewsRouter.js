import { Router } from "express";
import * as viewsController from "../controllers/views.controller.js";

const router = Router();

// Middleware interno para proteger vistas
const requireAuth = (req, res, next) => {
  if (!res.locals.user) return res.redirect("/login");
  next();
};

const isAdmin = (req, res, next) => {
  if (res.locals.user && res.locals.user.role === "admin") {
    return next();
  }
  res.redirect("/products");
};

router.get("/login", viewsController.getLogin);
router.get("/register", viewsController.getRegister);
router.get(
  "/realtimeproducts",
  requireAuth,
  isAdmin,
  viewsController.getRealTimeProducts,
);

router.get("/", requireAuth, viewsController.getHome);
router.get("/products", requireAuth, viewsController.getProductsList);
router.get("/products/:pid", requireAuth, viewsController.getProductDetail);
router.get(
  "/realtimeproducts",
  requireAuth,
  viewsController.getRealTimeProducts,
);
router.get("/cart/:cid", requireAuth, viewsController.getCartDetail);

// Alias para evitar errores de tipeo en la URL
router.get("/carts/:cid", requireAuth, viewsController.getCartDetail);

export default router;
