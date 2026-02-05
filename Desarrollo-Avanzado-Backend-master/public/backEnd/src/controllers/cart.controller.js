import { productDBManager } from "../dao/productDBManager.js";
import { cartDBManager } from "../dao/cartDBManager.js";

const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

export const getProductsFromCartByID = async (req, res) => {
  try {
    const result = await CartService.getProductsFromCartByID(req.params.cid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const createCart = async (req, res) => {
  try {
    const result = await CartService.createCart();
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const addProductByID = async (req, res) => {
  try {
    const result = await CartService.addProductByID(
      req.params.cid,
      req.params.pid,
    );
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteProductByID = async (req, res) => {
  try {
    const result = await CartService.deleteProductByID(
      req.params.cid,
      req.params.pid,
    );
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const updateAllProducts = async (req, res) => {
  try {
    const result = await CartService.updateAllProducts(
      req.params.cid,
      req.body.products,
    );
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const updateProductByID = async (req, res) => {
  try {
    const result = await CartService.updateProductByID(
      req.params.cid,
      req.params.pid,
      req.body.quantity,
    );
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    const result = await CartService.deleteAllProducts(req.params.cid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
};
