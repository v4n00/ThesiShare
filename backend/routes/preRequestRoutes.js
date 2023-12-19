import express from 'express';
import { acceptPreRequest, createPreRequest, getPreRequestsByStudentId, getPreRequestsFromRegistrationSessionByProfessorId, rejectPreRequest } from '../models/preRequest.js';

const preRequestRoutes = express.Router();

// accept a prerequest
preRequestRoutes.route('/prerequest/accept').put(async (req, res) => {
	const { requestId } = req.body;
	if (!requestId) return res.status(400).json('Bad Request');

	try {
		let request = await acceptPreRequest(requestId);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// reject a prerequest
preRequestRoutes.route('/prerequest/reject').put(async (req, res) => {
	const { requestId, justification } = req.body;
	if (!requestId) return res.status(400).json('Bad Request');

	try {
		let request = await rejectPreRequest(requestId, justification);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// returns all preRequests for a given student id
preRequestRoutes.route('/prerequest/student/:studentId').get(async (req, res) => {
	const studentId = req.params.studentId;
	if (!studentId) return res.status(400).json('Bad Request');

	try {
		let requests = await getPreRequestsByStudentId(studentId);
		return res.status(200).json(requests);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// returns all preRequests for a given professor id
preRequestRoutes.route('/prerequest/professor/:professorId').get(async (req, res) => {
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

// create preRequest
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
