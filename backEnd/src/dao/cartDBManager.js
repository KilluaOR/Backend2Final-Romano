import { cartModel } from "./models/cartModel.js";

export const CartDAO = {
  findById: async (cid, populate = false) => {
    const query = cartModel.findOne({ _id: cid });
    if (populate) {
      query.populate("products.product");
    }
    const cart = await query;
    return cart ?? null;
  },

  create: async () => cartModel.create({ products: [] }),

  updateProducts: async (cid, products) => {
    await cartModel.updateOne({ _id: cid }, { products });
    return cartDAO.findById(cid, true);
  },
};
