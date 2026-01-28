import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import sessionsRouter from './routes/sessionsRouter.js';
import usersRouter from './routes/usersRouter.js';
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';
import { initializePassport, jwtSecret } from './config/passport.config.js';
import { userModel } from './dao/models/userModel.js';

const app = express();

const uri = 'mongodb://127.0.0.1:27017/entrega-final';
mongoose.connect(uri);

//Handlebars Config
app.engine(
  'handlebars',
  handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/../views/layouts',
    partialsDir: __dirname + '/../views/partials',
    helpers: {
      multiply: (a, b) => Number(a ?? 0) * Number(b ?? 0),
      cartTotal: (products) => {
        if (!Array.isArray(products)) return 0;
        return products.reduce((acc, item) => {
          const price = Number(item?.product?.price ?? 0);
          const qty = Number(item?.quantity ?? 0);
          return acc + price * qty;
        }, 0);
      },
    },
  })
);
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Passport
initializePassport();
app.use(passport.initialize());

// Middleware para exponer usuario logueado en las vistas (navbar, saludo, etc.)
app.use(async (req, res, next) => {
  const token = req.cookies?.jwtCookie;

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await userModel.findById(payload.id).lean();

    if (user) {
      res.locals.user = user;
    }
  } catch (error) {
    // si el token es inválido o expiró, simplemente seguimos sin user
  }

  next();
});

//Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);

const PORT = 8081;
const httpServer = app.listen(PORT, () => {
  console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);