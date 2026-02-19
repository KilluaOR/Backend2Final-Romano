import { productModel } from "./models/productModel.js";

export const productDAO = {
  findPaginated: async (filter, options) => {
    return await productModel.paginate(filter, options);
  },

  findById: async (pid) => {
    return (await productModel.findOne({ _id: pid }).lean()) ?? null;
  },

  create: async (data) => {
    return await productModel.create(data);
  },

  update: async (id, data) => {
    return await productModel.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  delete: async (pid) => {
    return await productModel.deleteOne({ _id: pid });
  },
};
