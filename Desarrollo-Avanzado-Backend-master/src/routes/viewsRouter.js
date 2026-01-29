import { Router } from 'express';
import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';

const router = Router();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

// Middleware para requerir autenticación
const requireAuth = (req, res, next) => {
  if (!res.locals.user) {
    return res.redirect('/login');
  }
  next();
};

// Rutas públicas (sin autenticación)
router.get('/login', (req, res) => {
    // Si ya está logueado, redirigir a home
    if (res.locals.user) {
        return res.redirect('/');
    }
    res.render('login', {
        title: 'Login',
        style: 'index.css'
    });
});

router.get('/register', (req, res) => {
    // Si ya está logueado, redirigir a home
    if (res.locals.user) {
        return res.redirect('/');
    }
    res.render('register', {
        title: 'Registro',
        style: 'index.css'
    });
});

// Rutas protegidas (requieren autenticación)
router.get('/', requireAuth, (req, res) => {
    res.render('home', {
        title: 'Inicio',
        style: 'index.css'
    });
});

router.get('/products', requireAuth, async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);

    res.render(
        'productsList',
        {
            title: 'Productos',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(products.docs)),
            prevLink: {
                exist: products.prevLink ? true : false,
                link: products.prevLink
            },
            nextLink: {
                exist: products.nextLink ? true : false,
                link: products.nextLink
            }
        }
    )
});

router.get('/products/:pid', requireAuth, async (req, res) => {
    try {
        const product = await ProductService.getProductByID(req.params.pid);
        res.render('productDetail', {
            title: 'Detalle de producto',
            style: 'index.css',
            product: JSON.parse(JSON.stringify(product))
        });
    } catch (error) {
        res.status(404).render('notFound', {
            title: 'Not Found',
            style: 'index.css'
        });
    }
});

router.get('/realtimeproducts', requireAuth, async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);
    res.render(
        'realTimeProducts',
        {
            title: 'Productos',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(products.docs))
        }
    )
});

router.get('/cart/:cid', requireAuth, async (req, res) => {
    try {
        const response = await CartService.getProductsFromCartByID(req.params.cid);

        res.render('cartDetail', {
            title: 'Carrito',
            style: 'index.css',
            cid: req.params.cid,
            products: JSON.parse(JSON.stringify(response.products))
        });
    } catch (error) {
        res.status(404).render('notFound', {
            title: 'Not Found',
            style: 'index.css'
        });
    }
});

router.get('/carts/:cid', requireAuth, async (req, res) => {
    try {
        const response = await CartService.getProductsFromCartByID(req.params.cid);

        res.render('cartDetail', {
            title: 'Carrito',
            style: 'index.css',
            cid: req.params.cid,
            products: JSON.parse(JSON.stringify(response.products))
        });
    } catch (error) {
        res.status(404).render('notFound', {
            title: 'Not Found',
            style: 'index.css'
        });
    }
});

export default router;