import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
    id: string;
    username: string;
    email: string;
}

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'supersecuresecret';
const EXPIRATION_TIME = '1h';

export const generateToken = (username: string, email: string, id: string) => {
    const payload = { username, email, id };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
};

export const authenticateRequest = ({ req }: { req: any }) => {
    let token = req.headers.authorization || '';

    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    if (!token) {
        return { user: null };
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
        return { user: decoded };
    } catch (error) {
        console.error('Invalid token:', error);
        return { user: null };
    }
};
