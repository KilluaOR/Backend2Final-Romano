import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from "passport-jwt";
import { userService } from "../services/user.service.js";
import { isValidPassword } from "../utils/bcryptUtil.js";

const JWT_SECRET = process.env.JWT_SECRET || "coderSecretJWT";

// Extractor de cookie reutilizable
const cookieExtractor = (req) =>
  req?.signedCookies?.jwtCookie || req?.cookies?.jwtCookie;

export const initializePassport = () => {
  // ESTRATEGIA: Registro
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true, session: false },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          const result = await userService.register({
            first_name,
            last_name,
            email,
            age,
            password,
          });

          if (!result.success)
            return done(null, false, { message: result.message });
          return done(null, result.user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  // ESTRATEGIA: Login
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        try {
          const user = await userService.getByEmail(email);
          if (!user)
            return done(null, false, { message: "Usuario no encontrado" });

          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Credenciales inválidas" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  // ESTRATEGIA: JWT (Común para 'jwt' y 'current')
  const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: JWT_SECRET,
  };

  const jwtVerify = async (jwtPayload, done) => {
    try {
      const user = await userService.getById(jwtPayload.id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };

  passport.use("jwt", new JWTStrategy(jwtOptions, jwtVerify));
  passport.use("current", new JWTStrategy(jwtOptions, jwtVerify));
};

export const jwtSecret = JWT_SECRET;
