import { productService } from "../services/product.service.js";

export const getAll = async (req, res) => {
  try {
    const result = await productService.getAll(req.query);

    res.send({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const result = await productService.getById(req.params.pid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(404).send({
      status: "error",
      message: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    if (req.files) {
      req.body.thumbnails = req.files.map((file) => file.path);
    }

    const result = await productService.create(req.body);
    res.status(201).send({
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

export const update = async (req, res) => {
  try {
    const { pid } = req.params;

    if (req.files && req.files.length > 0) {
      req.body.thumbnails = req.files.map((file) => file.path);
    }

    const result = await productService.update(pid, req.body);

    res.send({
      status: "success",
      message: "Producto actualizado correctamente",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.pid);
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
