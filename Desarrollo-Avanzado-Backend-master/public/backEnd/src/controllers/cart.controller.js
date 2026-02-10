import { cartRepository } from "../repositories/cart.repository.js";

export const getProductsFromCartByID = async (req, res) => {
  try {
    const result = await cartRepository.getCart(req.params.cid);
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
    const result = await cartRepository.createCart();
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
    const result = await cartRepository.addProduct(
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
    const result = await cartRepository.deleteProduct(
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
    const result = await cartRepository.updateAllProducts(
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
    const result = await cartRepository.updateProduct(
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
    const result = await cartRepository.emptyCart(req.params.cid);
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
