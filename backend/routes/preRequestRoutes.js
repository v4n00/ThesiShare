import express from 'express';
import { verifyProfessor, verifyStudent, verifyToken } from '../middleware/authMiddleware.js';
import { acceptPreRequest, createPreRequest, getPreRequestsByStudentId, getPreRequestsFromRegistrationSessionByProfessorId, rejectPreRequest, getPreRequestsBySessionId } from '../models/preRequest.js';

const preRequestRoutes = express.Router();

// IMPORTANT:
// preRequest status can be:
// 'pending'
// 'accepted'
// 'rejected'

// accept a prerequest
preRequestRoutes.route('/prerequest/accept').put(verifyProfessor, async (req, res) => {
	// returns the preRequest data
	// request body should have these 1 parameter
	// requestId - int
	const requestId = req.body.id;
	
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
preRequestRoutes.route('/prerequest/reject').put(verifyProfessor, async (req, res) => {
	// returns the preRequest data
	// request body should have these 2 parameters
	// requestId - int
	// justification - string
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
preRequestRoutes.route('/prerequest/student/:studentId').get(verifyStudent, async (req, res) => {
	// returns all preRequests (array) for a given student id
	// request params should have 1 parameter
	// studentId - int
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
preRequestRoutes.route('/prerequest/professor/:professorId').get(verifyProfessor, async (req, res) => {
	// returns all preRequests (array) for a given professor id
	// request params should have 1 parameter
	// professorId - int
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

// get preRequest by session id
preRequestRoutes.route('/prerequest/:sessionId').get(verifyProfessor, async (req, res) => {
    // returns all preRequests (array) for a given session id
    // request params should have 1 parameter
    // sessionId - int
    const sessionId = req.params.sessionId;
    if (!sessionId) return res.status(400).json('Bad Request');

    try {
        let requests = await getPreRequestsBySessionId(sessionId);
        return res.status(200).json(requests);
    } catch (e) {
        console.warn(e.stack);
        return res.status(500).json(e.message);
    }
});


// get preRequest by id
preRequestRoutes.route('/prerequest/:id').get(verifyToken, async (req, res) => {
	// returns the preRequest data
	// request params should have 1 parameter
	// id - int
	const id = req.params.id;
	if (!id) return res.status(400).json('Bad Request');

	try {
		let request = await getPreRequestById(id);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// create preRequest
preRequestRoutes.route('/prerequest').post(verifyStudent, async (req, res) => {
	// returns the preRequest data
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
