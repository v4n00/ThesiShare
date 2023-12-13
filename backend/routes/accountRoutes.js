import express from 'express';
import Professor from '../entities/Professor.js';
import Student from '../entities/Student.js';
import { createUser, getUserByEmailAndCheckPassword } from '../entities/User.js';

const accountsRoutes = express.Router();

// Student login route
accountsRoutes.route('/student/login').get((req, res) => {
	// request body should have these 2 parameters
	// email - string
	// password - string
	return loginHandler(req, res, Student);
});

// Professor login route
accountsRoutes.route('/professor/login').get((req, res) => {
	// request body should have these 2 parameters
	// email - string
	// password - string
	return loginHandler(req, res, Professor);
});

// Student register route
accountsRoutes.route('/student/register').post((req, res) => {
	// request body should have these 4 parameters
	// name - string
	// email - string
	// password - string
	// repeatPassword - string
	return registerHandler(req, res, Student);
});

// Professor register route
accountsRoutes.route('/professor/register').post((req, res) => {
	// request body should have these 4 parameters
	// name - string
	// email - string
	// password - string
	// repeatPassword - string
	return registerHandler(req, res, Professor);
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
		return res.status(401).json(e.message);
	}
}

async function registerHandler(req, res, userType) {
	const { name, email, password, repeatPassword } = req.body;

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
		await createUser(userType, { name, email, password });
		return res.status(201).json(`Registered successfully`);
	} catch (e) {
		return res.status(409).json(e.message);
	}
}

export default accountsRoutes;
