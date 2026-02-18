import { productModel } from "./models/productModel.js";

export const ProductDAO = {
  findPaginated: async (filter, options) => {
    return await productModel.paginate(filter, options);
  },

  findById: async (pid) => {
    return (await productModel.findOne({ _id: pid }).lean()) ?? null;
  },

  create: async (data) => {
    return await productModel.create(data);
  },

  update: async (pid, data) => {
    return await productModel.updateOne({ _id: pid }, data);
  },

  delete: async (pid) => {
    return await productModel.deleteOne({ _id: pid });
  },
};
