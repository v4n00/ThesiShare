import express from 'express';
import professor from '../models/professor.js';
import student from '../models/student.js';
import { createUser, getUserByEmailAndCheckPassword } from '../models/user.js';

const accounts = express.Router();

// student login route
accounts.route('/student/login').get((req, res) => {
	// request body should have these 2 parameters
	// email - string
	// password - string
	return loginHandler(req, res, student);
});

// professor login route
accounts.route('/professor/login').get((req, res) => {
	// request body should have these 2 parameters
	// email - string
	// password - string
	return loginHandler(req, res, professor);
});

// student register route
accounts.route('/student/register').post((req, res) => {
	// request body should have these 4 parameters
	// name - string
	// email - string
	// password - string
	// repeatPassword - string
	return registerHandler(req, res, student);
});

// professor register route
accounts.route('/professor/register').post((req, res) => {
	// request body should have these 4 parameters
	// name - string
	// email - string
	// password - string
	// repeatPassword - string
	return registerHandler(req, res, professor);
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
		return res.status(201).json(`${userType.name} registered successfully`);
	} catch (e) {
		return res.status(409).json(e.message);
	}
}

export default accounts;
