import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import jwt from "jsonwebtoken";

// Routers e internos
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import websocket from "./websocket.js";
import { initializePassport, jwtSecret } from "./config/passport.config.js";
import { userService } from "./services/user.service.js";
import { toUserCurrentDTO } from "./dto/user.dto.js";

// --- Configuración de Rutas y Env ---
const __filenameApp = fileURLToPath(import.meta.url);
const __dirnameApp = path.dirname(__filenameApp);
const realRoot = path.resolve(__dirnameApp, "..", "..");
const envPath = path.join(realRoot, ".env");

const result = dotenv.config({ path: envPath });
if (result.error && process.env.NODE_ENV !== "production") {
  console.warn("⚠️ No se encontró .env en:", envPath);
}

const app = express();

// --- Middlewares de Base ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// --- Handlebars Config ---
const viewsPath = path.join(__dirnameApp, "views");
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    layoutsDir: path.join(viewsPath, "layouts"),
    partialsDir: path.join(viewsPath, "partials"),
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
      isAdmin: (role) => role === "admin",
    },
  }),
);
app.set("views", viewsPath);
app.set("view engine", "handlebars");

// --- Estáticos ---
const publicPath = path.join(realRoot, "public", "frontEnd");
app.use(express.static(publicPath));

// --- Passport ---
initializePassport();
app.use(passport.initialize());

// --- Middleware de Sesión ---
app.use(async (req, res, next) => {
  const token = req.signedCookies?.jwtCookie || req.cookies?.jwtCookie;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, jwtSecret);
    const userDoc = await userService.getByIdSafe(payload.id);
    if (userDoc) {
      res.locals.user = toUserCurrentDTO(userDoc);
    }
  } catch (error) {
    console.error("JWT Verify error:", error.message);
  }
  next();
});

// --- Routers ---
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);

// --- MongoDB y Server Start ---
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
    console.log("🔗 Intentando conectar a MongoDB:", uriForLog);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Conexión a MongoDB exitosa");
    console.log(`   Base de datos: ${mongoose.connection.name}`);
    console.log(`   Entorno: ${usingAtlas ? "Atlas (Nube)" : "Localhost"}`);
  } catch (error) {
    console.error("❌ Error en la conexión a MongoDB:");

    if (
      error.message.includes("ETIMEOUT") ||
      error.message.includes("selection timeout")
    ) {
      console.error(
        "   → Error de tiempo de espera. ¿Tu IP está habilitada en Atlas (Network Access)?",
      );
    } else if (error.message.includes("auth failed")) {
      console.error(
        "   → Error de autenticación. Revisá usuario y contraseña en el .env",
      );
    } else {
      console.error(`   → ${error.message}`);
    }

    process.exit(1);
  }
}

async function start() {
  await connectDB();
  const httpServer = app.listen(process.env.PORT || 8081, () => {
    console.log(`🚀 Server ready on port ${process.env.PORT || 8081}`);
  });
  const io = new Server(httpServer);
  websocket(io);
}

start();
