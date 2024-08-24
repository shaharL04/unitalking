import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Make sure to set a strong secret key in your environment variables

const generateToken = (userId: number): string => {
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '24h' });
    return token;
};

export default generateToken;
