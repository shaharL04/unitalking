import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key'; // Make sure this matches the key used for signing tokens

function validateAuthToken(authToken: string): string | null {
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
