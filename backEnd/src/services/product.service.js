import { productRepository } from "../repositories/product.repository.js";

export const productService = {
  getAll(params) {
    return productRepository.getAll(params);
  },
  getById(pid) {
    return productRepository.getById(pid);
  },
  create(data) {
    return productRepository.create(data);
  },
  update(pid, data) {
    return productRepository.update(pid, data);
  },
  delete(pid) {
    return productRepository.delete(pid);
  },
};
