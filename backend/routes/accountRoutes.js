import express from 'express';
import { createProfessor, getProfessorByEmailAndPassword } from '../entities/Professor.js';
import { createStudent, getStudentByEmailAndPassword } from '../entities/Student.js';

const accountsRoutes = express.Router();

// Student login
accountsRoutes.route('/student/login').get(async (req, res) => {
	// request body should have these 2 parameters
	// email - string
	// password - string
	const { email, password } = req.body;

	// check malformed request
	if (!email || !password) return res.status(400).json('Bad Request');

	try {
		// return student if found
		const student = await getStudentByEmailAndPassword(email, password);
		return res.status(200).json(student);
	} catch (e) {
		console.warn(e.stack);
		return res.status(401).json(e.message);
	}
});

// Professor login
accountsRoutes.route('/professor/login').get(async (req, res) => {
	// request body should have these 2 parameters
	// email - string
	// password - string
	const { email, password } = req.body;

	// check malformed request
	if (!email || !password) return res.status(400).json('Bad Request');

	try {
		// return professor if found
		let professor = await getProfessorByEmailAndPassword(email, password);
		return res.status(200).json(professor);
	} catch (e) {
		console.warn(e.stack);
		return res.status(401).json(e.message);
	}
});

// Student register
accountsRoutes.route('/student/register').post(async (req, res) => {
	// request body should have these 4 parameters
	// name - string
	// email - string
	// password - string
	// repeatPassword - string
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

	// create user
	try {
		await createStudent({ name, email, password });
	} catch (e) {
		return res.status(409).json(e.message);
	}
	return res.status(201).json('Student registered successfully');
});

// Professor register
accountsRoutes.route('/professor/register').post(async (req, res) => {
	// request body should have these 4 parameters
	// name - string
	// email - string
	// password - string
	// repeatPassword - string
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

	// create user
	try {
		await createProfessor({ name, email, password });
	} catch (e) {
		return res.status(409).json(e.message);
	}
	return res.status(201).json('Professor registered successfully');
});

export default accountsRoutes;
