import express from 'express';
import professor from '../models/professor.js';
import student from '../models/student.js';
import { createUser, getUserByEmailAndCheckPassword } from '../models/user.js';

const accountRoutes = express.Router();

// student login route
accountRoutes.route('/student/login').post(async (req, res) => {
	// returns the user data
	// request body should have these 2 parameters
	// email - string
	// password - string
	return await loginHandler(req, res, student);
});

// professor login route
accountRoutes.route('/professor/login').post(async (req, res) => {
	// returns the user data
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

async function loginHandler(req, res, userType) {
	const { email, password } = req.body;

	// check malformed request
	if (!email || !password) return res.status(400).json('Bad Request');

	try {
		const user = await getUserByEmailAndCheckPassword(userType, email, password);
		return res.status(200).json(user);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
}

async function registerHandler(req, res, userType) {
	const { name, email, password, repeatPassword } = req.body;

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

	try {
		const user = await createUser(userType, { name, email, password });
		return res.status(201).json(user);
	} catch (e) {
		return res.status(500).json(e.message);
	}
}

export default accountRoutes;
