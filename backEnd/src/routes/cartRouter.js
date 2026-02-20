import { Router } from "express";
import passport from "passport";
import {
  requireUser,
  requireUserCart,
} from "../middlewares/authorization.middleware.js";
import {
  addProductByID,
  createCart,
  deleteAllProducts,
  deleteProductByID,
  getProductsFromCartByID,
  updateAllProducts,
  updateProductByID,
  purchase,
} from "../controllers/cart.controller.js";

const router = Router();
const authenticate = passport.authenticate("current", { session: false });

router.post(
  "/:cid/purchase",
  authenticate,
  requireUser,
  requireUserCart,
  purchase,
);

router.get("/:cid", authenticate, requireUserCart, getProductsFromCartByID);

router.post("/", createCart);

router.post(
  "/:cid/product/:pid",
  authenticate,
  requireUser,
  requireUserCart,
  addProductByID,
);

router.delete(
  "/:cid/product/:pid",
  authenticate,
  requireUserCart,
  deleteProductByID,
);

router.put("/:cid", authenticate, requireUserCart, updateAllProducts);

router.put(
  "/:cid/product/:pid",
  authenticate,
  requireUserCart,
  updateProductByID,
);

router.delete("/:cid", authenticate, requireUserCart, deleteAllProducts);

export default router;
