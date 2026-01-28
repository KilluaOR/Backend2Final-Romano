import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/passport.config.js';

const router = Router();

// Registro de usuario
router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  (req, res) => {
    const user = req.user;
    res.status(201).send({
      status: 'success',
      message: 'Usuario registrado correctamente',
      payload: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
      },
    });
  }
);

// Login de usuario con generación de JWT en cookie httpOnly
router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res
      .cookie('jwtCookie', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .send({
        status: 'success',
        message: 'Login exitoso',
      });
  }
);

// Endpoint current protegido con estrategia JWT de Passport
router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  (req, res) => {
    const user = req.user;
    res.send({
      status: 'success',
      payload: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart,
      },
    });
  }
);

// Cerrar sesión: borra la cookie y redirige al formulario de login
router.post('/logout', (req, res) => {
  res.clearCookie('jwtCookie').redirect('/login');
});

export default router;

