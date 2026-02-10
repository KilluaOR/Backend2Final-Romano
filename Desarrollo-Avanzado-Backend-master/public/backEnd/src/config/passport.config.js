import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import { userRepository } from '../repositories/user.repository.js';
import { isValidPassword } from '../utils/bcryptUtil.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const JWT_SECRET = process.env.JWT_SECRET || 'coderSecretJWT';

export const initializePassport = () => {
  // Registro (usa UserRepository: crear carrito + usuario)
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
          const result = await userRepository.register({
            first_name,
            last_name,
            email,
            age,
            password,
          });
          if (!result.success) {
            return done(null, false, { message: result.message });
          }
          return done(null, result.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Login (usa UserRepository)
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await userRepository.getByEmail(email);
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

  // JWT strategy para endpoints protegidos
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([
          (req) => req?.signedCookies?.jwtCookie || req?.cookies?.jwtCookie,
        ]),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await userRepository.getById(jwtPayload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia "current" (usa UserRepository)
  passport.use(
    'current',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([
          (req) => req?.signedCookies?.jwtCookie || req?.cookies?.jwtCookie,
        ]),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await userRepository.getById(jwtPayload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export const jwtSecret = JWT_SECRET;

