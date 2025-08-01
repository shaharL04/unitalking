import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key'; 

function validateAuthToken(authToken: string): number | null {
  if (!authToken) {
    return null;
  }

  try {
    const decoded: any = jwt.verify(authToken, SECRET_KEY);
    return decoded.userId || null;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

export default validateAuthToken;
