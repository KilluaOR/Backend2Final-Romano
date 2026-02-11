import { productDBManager } from '../dao/productDBManager.js';

const productDAO = new productDBManager();

/**
 * Repository de productos. Usa el DAO y concentra la lógica de negocio.
 * La restricción "solo admin" se aplica en rutas con middleware, no aquí.
 */
export const productRepository = {
  async getAll(params) {
    return productDAO.getAllProducts(params);
  },

  async getById(pid) {
    return productDAO.getProductByID(pid);
  },

  async create(productData) {
    return productDAO.createProduct(productData);
  },

  async update(pid, productUpdate) {
    return productDAO.updateProduct(pid, productUpdate);
  },

  async delete(pid) {
    return productDAO.deleteProduct(pid);
  },
};
