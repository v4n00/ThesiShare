import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config/const.js';
import professor from '../models/professor.js';
import student from '../models/student.js';
import { createUser, getUserByEmailAndCheckPassword } from '../models/user.js';

const accountRoutes = express.Router();

// student login route
accountRoutes.route('/student/login').post(async (req, res) => {
	// returns the user data and a token
	// {
	// 	"user": {
	// 		"studentId": 2,
	// 		"name": "Student Test",
	// 		"email": "test@gmail.com",
	// 		"password": "$2b$10$QkMip35R4Nknfg5gsjGVKOY5ADiX.wLKWzLAvjBehKZoIAeCpEpwS"
	// 	},
	// 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUHJvZmVzc29yIiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsIm5hbWUiOiJQcm9mZXNzb3IgVGVzdCIsImlhdCI6MTcwMzA4NTY1MywiZXhwIjoxNzAzMDg1NjY4fQ._1tw74w_C9wJQxXpK3UePn5_i0wdbWo0rzBHZWxypCE"
	// }
	// request body should have these 2 parameters
	// email - string
	// password - string
	return await loginHandler(req, res, student);
});

// professor login route
accountRoutes.route('/professor/login').post(async (req, res) => {
	// returns the user data and a token
	// {
	// 	"user": {
	// 		"professorId": 2,
	// 		"name": "Professor Test",
	// 		"email": "test@gmail.com",
	// 		"password": "$2b$10$QkMip35R4Nknfg5gsjGVKOY5ADiX.wLKWzLAvjBehKZoIAeCpEpwS"
	// 	},
	// 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUHJvZmVzc29yIiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsIm5hbWUiOiJQcm9mZXNzb3IgVGVzdCIsImlhdCI6MTcwMzA4NTY1MywiZXhwIjoxNzAzMDg1NjY4fQ._1tw74w_C9wJQxXpK3UePn5_i0wdbWo0rzBHZWxypCE"
	// }
	// request body should have these 2 parameters
	// email - string
	// password - string
	return await loginHandler(req, res, professor);
});

// student register route
accountRoutes.route('/student/register').post(async (req, res) => {
	// returns the user data
	// request body should have these 4 parameters
	// name - string
	// email - string
	// password - string
	// repeatPassword - string
	return await registerHandler(req, res, student);
});

// professor register route
accountRoutes.route('/professor/register').post(async (req, res) => {
	// returns the user data
	// request body should have these 4 parameters
	// name - string
	// email - string
	// password - string
	// repeatPassword - string
	return await registerHandler(req, res, professor);
});

// validate token route
accountRoutes.route('/validate-token').post(async (req, res) => {
	try {
		const token = req.body.token;
		if (!token) {
			return res.status(401).json('No token provided');
		}
		jwt.verify(token, JWT_KEY, (err, decodedToken) => {
			if (err) {
				return res.status(401).json('Invalid token');
			}
			return res.status(200).json({ message: 'Valid token', token, role: decodedToken.role, userId: decodedToken.userId });
		});
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

async function loginHandler(req, res, userType) {
	let { email, password } = req.body;

	// check malformed request
	if (!email || !password) return res.status(400).json('Bad Request');

	try {
		const user = await getUserByEmailAndCheckPassword(userType, email, password);
		return res.status(200).json({ user: user, token: generateToken(user, userType) });
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
}

async function registerHandler(req, res, userType) {
	let { name, email, password, repeatPassword } = req.body;

	if (!name || !email || !password || !repeatPassword) return res.status(400).json('Bad Request');

	// email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json('Invalid email format');
	}

	// password validations
	if (password !== repeatPassword) {
		return res.status(400).json('Passwords do not match');
	}

	if (password.length < 8) {
		return res.status(400).json('Password must be at least 8 characters long');
	}

	// encrypt passwords
	const salt = await bcrypt.genSalt(10);
	password = await bcrypt.hash(password, salt);

	try {
		const user = await createUser(userType, { name, email, password });
		return res.status(201).json(user);
	} catch (e) {
		return res.status(500).json(e.message);
	}
}

function generateToken(user, userType) {
	return jwt.sign(
		{
			userId: user.professorId || user.studentId,
			role: userType.name, // capitalised, e.g. 'Student' or 'Professor'
			email: user.email,
			name: user.name,
		},
		JWT_KEY,
		{
			// edit this for token expiration
			expiresIn: '24h',
		}
	);
}

export default accountRoutes;
