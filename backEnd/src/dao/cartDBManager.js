import { cartModel } from "./models/cartModel.js";

class CartDAO {
  async findById(cid, populate = false) {
    const query = cartModel.findOne({ _id: cid });
    if (populate) {
      query.populate("products.product");
    }
    const cart = await query;
    return cart ?? null;
  }

  async create() {
    return cartModel.create({ products: [] });
  }

  async updateProducts(cid, products) {
    await cartModel.updateOne({ _id: cid }, { products });
    return this.findById(cid, true);
  }
}

const cartDAO = new CartDAO();
export { CartDAO, cartDAO };
