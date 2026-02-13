import productModel from "./models/productModel.js";

class ProductDAO {
  async findPaginated(filter, options) {
    return productModel.paginate(filter, options);
  }

  async findById(pid) {
    const product = await productModel.findOne({ _id: pid });
    return product ?? null;
  }

  async create(data) {
    return productModel.create(data);
  }

  async update(pid, data) {
    return productModel.updateOne({ _id: pid }, data);
  }

  async delete(pid) {
    return productModel.deleteOne({ _id: pid });
  }
}

const productDAO = new ProductDAO();
export { ProductDAO, productDAO };
