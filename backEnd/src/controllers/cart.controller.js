import { cartService } from "../services/cart.service.js";

export const getProductsFromCartByID = async (req, res) => {
  try {
    const result = await cartService.getCart(req.params.cid);
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
    const result = await cartService.createCart();
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
    const result = await cartService.addProduct(req.params.cid, req.params.pid);
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
    const result = await cartService.deleteProduct(
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
    const result = await cartService.updateAllProducts(
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
    const result = await cartService.updateProduct(
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
    const result = await cartService.emptyCart(req.params.cid);
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
