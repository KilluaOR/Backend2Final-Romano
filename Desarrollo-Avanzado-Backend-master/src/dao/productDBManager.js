import productModel from "./models/productModel.js";

class productDBManager {

    async getAllProducts(params) {
        const paginate = {
            page: params.page ? parseInt(params.page) : 1,
            limit: params.limit ? parseInt(params.limit) : 10,
        }

        if (params.sort && (params.sort === 'asc' || params.sort === 'desc')) paginate.sort = { price: params.sort}

        // Filtros: por categoría (string) o por disponibilidad (status true/false)
        let filter = {};
        if (params.query) {
            const q = params.query;
            if (q === 'true' || q === 'false') {
                filter = { status: q === 'true' };
            } else {
                filter = { category: q };
            }
        }

        const products = await productModel.paginate(filter, paginate);

        // Links relativos para que funcione en cualquier host/puerto
        products.prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}` : null;

        //Add limit
        if (products.prevLink && paginate.limit !== 10) products.prevLink += `&limit=${paginate.limit}`
        if (products.nextLink && paginate.limit !== 10) products.nextLink += `&limit=${paginate.limit}`

        //Add sort
        if (products.prevLink && paginate.sort) products.prevLink += `&sort=${params.sort}`
        if (products.nextLink && paginate.sort) products.nextLink += `&sort=${params.sort}`

        return products;
    }

    async getProductByID(pid) {
        const product = await productModel.findOne({_id: pid});

        if (!product) throw new Error(`El producto ${pid} no existe!`);

        return product;
    }

    async createProduct(product) {
        const {title, description, code, price, stock, category, thumbnails, status} = product;

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Error al crear el producto');
        }

        return await productModel.create({title, description, code, price, stock, category, thumbnails, status});  
    }

    async updateProduct(pid, productUpdate) {
        return await productModel.updateOne({_id: pid}, productUpdate);
    }

    async deleteProduct(pid) {
        const result = await productModel.deleteOne({_id: pid});

        if (result.deletedCount === 0) throw new Error(`El producto ${pid} no existe!`);

        return result;
    }
}

export { productDBManager };