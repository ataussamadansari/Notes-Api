import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SERCRET_KEY = process.env.SECRET_KEY;

export const generateToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user._id },
        SERCRET_KEY,
        // '1d'
    );
}

export const verifyToken = (token) => {
    return jwt.verify(token, SERCRET_KEY);
}