import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import { userModel } from '../dao/models/userModel.js';
import { cartModel } from '../dao/models/cartModel.js';
import { createHash, isValidPassword } from '../utils/bcryptUtil.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const JWT_SECRET = 'coderSecretJWT'; // para el proyecto de curso; idealmente usar env var

export const initializePassport = () => {
  // Registro
  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
        session: false,
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: 'El usuario ya existe' });
          }

          const cart = await cartModel.create({ products: [] });

          const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cart._id,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Login
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
          }

          if (!isValidPassword(user, password)) {
            return done(null, false, { message: 'Credenciales inválidas' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // JWT strategy para endpoints protegidos (incluido /current)
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([
          (req) => req?.cookies?.jwtCookie,
        ]),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await userModel.findById(jwtPayload.id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia "current" (alias de JWT) para cumplir consigna
  passport.use(
    'current',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([
          (req) => req?.cookies?.jwtCookie,
        ]),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await userModel.findById(jwtPayload.id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export const jwtSecret = JWT_SECRET;

