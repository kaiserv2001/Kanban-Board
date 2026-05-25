import { validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { catchAsync } from '../middleware/errorHandler.js';

export const register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, passwordHash: password });
  generateToken(res, user._id);
  res.status(201).json({ user });
});

export const login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  generateToken(res, user._id);
  res.json({ user });
});

export const logout = (_req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

export const getMe = catchAsync(async (req, res) => {
  res.json({ user: req.user });
});
