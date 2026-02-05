import { Router } from 'express';
import passport from 'passport';
import { userModel } from '../dao/models/userModel.js';

const router = Router();

const requireJwt = passport.authenticate('jwt', { session: false });

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).send({ status: 'error', message: 'Forbidden' });
  }
  next();
};

// GET /api/users (admin)
router.get('/', requireJwt, requireAdmin, async (req, res) => {
  const users = await userModel.find().select('-password').lean();
  res.send({ status: 'success', payload: users });
});

// GET /api/users/:uid (admin o mismo usuario)
router.get('/:uid', requireJwt, async (req, res) => {
  const { uid } = req.params;
  const isSelf = req.user?._id?.toString() === uid;
  const isAdmin = req.user?.role === 'admin';

  if (!isSelf && !isAdmin) {
    return res.status(403).send({ status: 'error', message: 'Forbidden' });
  }

  const user = await userModel.findById(uid).select('-password').lean();
  if (!user) {
    return res.status(404).send({ status: 'error', message: 'User not found' });
  }
  res.send({ status: 'success', payload: user });
});

// PUT /api/users/:uid (admin o mismo usuario) - NO permite cambiar password acá
router.put('/:uid', requireJwt, async (req, res) => {
  const { uid } = req.params;
  const isSelf = req.user?._id?.toString() === uid;
  const isAdmin = req.user?.role === 'admin';

  if (!isSelf && !isAdmin) {
    return res.status(403).send({ status: 'error', message: 'Forbidden' });
  }

  const { first_name, last_name, age, role } = req.body;

  const update = {};
  if (typeof first_name === 'string') update.first_name = first_name;
  if (typeof last_name === 'string') update.last_name = last_name;
  if (typeof age !== 'undefined') update.age = Number(age);
  if (isAdmin && typeof role === 'string') update.role = role;

  const updated = await userModel
    .findByIdAndUpdate(uid, update, { new: true })
    .select('-password')
    .lean();

  if (!updated) {
    return res.status(404).send({ status: 'error', message: 'User not found' });
  }

  res.send({ status: 'success', payload: updated });
});

// DELETE /api/users/:uid (admin)
router.delete('/:uid', requireJwt, requireAdmin, async (req, res) => {
  const { uid } = req.params;
  const result = await userModel.deleteOne({ _id: uid });
  if (result.deletedCount === 0) {
    return res.status(404).send({ status: 'error', message: 'User not found' });
  }
  res.send({ status: 'success' });
});

export default router;

