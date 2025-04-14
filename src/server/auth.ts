import dotenv from 'dotenv';
dotenv.config();
import express, { Router, Request, Response, NextFunction } from 'express';
import session from 'express-session';

export const getSession = () => {
  const SESSION_SECRET = process.env.SESSION_SECRET;
  if (!SESSION_SECRET) throw new Error('SESSION_SECRET not found');
  return session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  });
};

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export function authRouter() {
  const APP_PASSWORD = process.env.APP_PASSWORD;
  if (!APP_PASSWORD) throw new Error('APP_PASSWORD not configured');
  const router = Router();
  router.use(express.json());
  router.post('/login', (req: Request, res: Response) => {
    if (req.body.password === APP_PASSWORD) {
      req.session.auth = true;
      return res.json({ success: true });
    }
    res.status(401).json({ error: 'Invalid password' });
  });
  return router;
}
