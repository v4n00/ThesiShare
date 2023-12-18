import express from 'express';
import { createPreRequest, getPreRequestsFromRegistrationSessionByProfessorId } from '../models/preRequest.js';

const preRequestRoutes = express.Router();

// accept a prerequest

// deny a prerequest

// returns all preRequests for a given professor id
preRequestRoutes.route('/prerequest/:professorId').get(async (req, res) => {
	const professorId = req.params.professorId;
	if (!professorId) return res.status(400).json('Bad Request');

	try {
		let requests = await getPreRequestsFromRegistrationSessionByProfessorId(professorId);
		return res.status(200).json(requests);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

preRequestRoutes.route('/prerequest').post(async (req, res) => {
	// request body should have these 3 parameters
	// studentId - int
	// sessionId - int
	// title - string
	const { studentId, sessionId, title } = req.body;

	// check malformed request
	if (!studentId || !sessionId || !title) return res.status(400).json('Bad Request');

	try {
		const session = await createPreRequest({ studentId, sessionId, title });
		return res.status(200).json(session);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

export default preRequestRoutes;
