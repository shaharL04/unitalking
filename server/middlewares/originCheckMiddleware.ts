import { Request, Response, NextFunction } from 'express';

const allowedOrigin = 'http://localhost:3000';

const checkOrigin = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  if (origin && origin === allowedOrigin) {
    console.log(origin && origin === allowedOrigin)
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid Origin' });
  }
};
export default checkOrigin;