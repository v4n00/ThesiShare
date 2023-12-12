import express from 'express';
import db from '../configDB.js';

let resetDB = express.Router();

resetDB.route('/reset-db').get(async (req, res) => {
	try {
		await db.sync({ force: true });
		res.status(201).json({ message: 'created' });
	} catch (err) {
		console.warn(err.stack);
		res.status(500).json({ message: 'server error' });
	}
});

export default resetDB;
