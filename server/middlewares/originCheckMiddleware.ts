import { Request, Response, NextFunction } from 'express';

const allowedOrigin = 'http://localhost:3000';

//This check origin should block everything that isn't directly from the frontend, not allowing even postman req
const checkOrigin = (req: Request, res: Response, next: NextFunction) => {
  
  //This lines bypass that and 
  if (req.path.startsWith('/chatPhotos')) {
    return next();
  }

  const origin = req.headers.origin;

  if (origin && origin === allowedOrigin) {
    console.log(origin && origin === allowedOrigin);
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid Origin' });
  }
};

export default checkOrigin;
