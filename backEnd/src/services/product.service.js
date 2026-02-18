import { productRepository } from "../repositories/product.repository.js";

export const productService = {
  getAll: (params) => productRepository.getAll(params),
  getById: (pid) => productRepository.getById(pid),
  create: (data) => productRepository.create(data),
  update: (pid, data) => productRepository.update(pid, data),
  delete: (pid) => productRepository.delete(pid),
};
