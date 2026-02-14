import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Cargar .env desde la raíz del proyecto (donde está package.json), sin depender del directorio de trabajo
const __filenameApp = fileURLToPath(import.meta.url);
const __dirnameApp = path.dirname(__filenameApp);
const projectRoot = path.resolve(__dirnameApp, "..");
const envPath = path.join(projectRoot, ".env");
const loaded = dotenv.config({ path: envPath });
if (loaded.error && process.env.NODE_ENV !== "production") {
  console.warn("⚠️  No se encontró .env en:", envPath);
}

import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import jwt from "jsonwebtoken";

import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import __dirname from "./utils/constantsUtil.js";
import websocket from "./websocket.js";
import { initializePassport, jwtSecret } from "./config/passport.config.js";
import { userModel } from "./dao/models/userModel.js";
import { userService } from "./services/user.service.js";

const app = express();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/entrega-final";
const usingAtlas = uri.includes("mongodb.net");
if (!process.env.MONGO_URI) {
  console.warn(
    "⚠️  MONGO_URI no definida → se usa localhost. Los datos se guardan en tu MongoDB local, NO en Atlas.",
  );
}

async function connectDB() {
  try {
    const uriForLog = uri.includes("@") ? uri.replace(/:(.*)@/, ":***@") : uri;
    console.log("Intentando conectar a MongoDB:", uriForLog);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    const db = mongoose.connection.db;
    console.log("✅ Connected to MongoDB successfully");
    console.log("   Base de datos:", db.databaseName);
    console.log("   Host:", usingAtlas ? "Atlas (cloud)" : "localhost");
    if (usingAtlas) {
      console.log(
        '   → En Compass, conectate con tu connection string de Atlas y abrí la base "' +
          db.databaseName +
          '" para ver los usuarios.',
      );
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Error completo:", error);

    if (
      error.message.includes("authentication failed") ||
      error.message.includes("bad auth")
    ) {
      console.error("\n💡 Revisá:");
      console.error("   - Usuario y contraseña en MONGO_URI (.env)");
      console.error(
        "   - En Atlas: Database Access → verificar que el usuario existe",
      );
      console.error("   - Si cambiaste la contraseña, actualizala en .env");
    }
    if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("getaddrinfo")
    ) {
      console.error("\n💡 Revisá:");
      console.error("   - La URL del cluster en MONGO_URI");
      console.error("   - Que el cluster en Atlas esté activo");
      console.error("   - Tu conexión a internet");
    }
    if (
      error.message.includes("timeout") ||
      error.message.includes("serverSelectionTimeoutMS")
    ) {
      console.error("\n💡 Revisá:");
      console.error("   - Network Access en Atlas → agregar tu IP o 0.0.0.0/0");
      console.error("   - Que el cluster no esté pausado");
    }

    process.exit(1);
  }
}

//Handlebars Config
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    layoutsDir: __dirname + "/../views/layouts",
    partialsDir: __dirname + "/../views/partials",
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
  }),
);
app.set("views", __dirname + "/../views");
app.set("view engine", "handlebars");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Passport
initializePassport();
app.use(passport.initialize());

// Middleware para exponer usuario logueado en las vistas (navbar, saludo, etc.)
app.use(async (req, res, next) => {
  // Si usamos cookie signing, leer desde signedCookies, sino desde cookies
  const token = req.signedCookies?.jwtCookie || req.cookies?.jwtCookie;

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await userService.getByIdSafe(payload.id).lean();

    if (user) {
      res.locals.user = user;
    }
  } catch (error) {
    // si el token es inválido o expiró, simplemente seguimos sin user
  }

  next();
});

//Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);

const PORT = process.env.PORT || 8081;

async function start() {
  await connectDB();
  const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
  });
  const io = new Server(httpServer);
  websocket(io);
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
