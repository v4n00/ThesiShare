import express from 'express';
import db from '../configDB.js';
import { createStudent } from '../entities/Student.js';

let resetDB = express.Router();

// route to reset to set/reset the local db
resetDB.route('/reset-db').get(async (req, res) => {
	try {
		await db.sync({ force: true });
		res.status(201).json('created');
	} catch (err) {
		console.warn(err.stack);
		res.status(500).json('server error');
	}
	let student = {
		name: 'test',
		email: 'test@test.com',
		password: '1234',
	};
	await createStudent(student);
});

export default resetDB;
