import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config/const.js';

export const verifyToken = (req, res, next) => {
	// check if header has authorization field
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json('Authorization header not provided');
	}

	// check if the token exists
	const token = authHeader.split(' ')[1];
	if (!token) {
		return res.status(401).json('No token provided');
	}

	// verify the token
	jwt.verify(token, JWT_KEY, (err, decodedToken) => {
		if (err) {
			return res.status(401).json('Invalid token');
		}
		req.decodedToken = decodedToken;
		next();
	});
};

// verify if the token belongs to a student
export const verifyStudent = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.decodedToken.role === 'Student') {
			next();
		} else {
			return res.status(403).json('Forbidden');
		}
	});
};

// verify if the token belongs to a professor
export const verifyProfessor = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.decodedToken.role === 'Professor') {
			next();
		} else {
			return res.status(403).json('Forbidden');
		}
	});
};
