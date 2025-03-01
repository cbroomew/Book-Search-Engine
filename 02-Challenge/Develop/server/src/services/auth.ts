import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || 'supersecretkey';
const expiration = '1h';

// Function to sign JWT tokens
export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: expiration });
};

// Function to authenticate requests in Apollo Server
export const authMiddleware = ({ req }: { req: any }) => {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return { user: decoded };
  } catch (err) {
    console.error('Invalid token:', err);
    return { user: null };
  }
};
