import express from 'express';
import { verifyProfessor, verifyStudent } from '../middleware/authMiddleware.js';
import { createRegistrationSession, getAllActiveRegistrationSessions, getAllRegistrationSessionByProfessorId } from '../models/registrationSession.js';

const registerSessionRoutes = express.Router();

registerSessionRoutes.route('/registration-session/').get(verifyStudent, async (req, res) => {
	// returns an array of sessions that are active as of today's date
	// also return the name of the professor
	// [
	//  {
	// 	"sessionId": 1,
	// 	"professorId": 1,
	// 	"startTime": "2021-12-14T10:46:48.000Z",
	// 	"endTime": "2025-12-14T10:46:48.000Z",
	// 	"currentStudents": 0,
	// 	"maxStudents": 5,
	// 	"Professor": {
	// 		"name": "test"
	// 	}
	// ]
	try {
		const sessions = await getAllActiveRegistrationSessions();
		return res.status(200).json(sessions);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

registerSessionRoutes.route('/registration-session/:professorId').get(verifyProfessor, async (req, res) => {
	// returns an array of sessions for a professor's id
	try {
		const sessions = await getAllRegistrationSessionByProfessorId(req.params.professorId);
		return res.status(200).json(sessions);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

registerSessionRoutes.route('/registration-session/create').post(verifyProfessor, async (req, res) => {
	// request body should have these 4 parameters
	// professorId - int
	// startTime - int, unix time in milliseconds!!!!!!!!!!!!!!!!!!! (not seconds, add 3 zeros)
	// endTime - int, unix time in milliseconds!!!!!!!!!!!!!!!!!!! (not seconds, add 3 zeros)
	// maxStudents - int > 1
	let { professorId, startTime, endTime, maxStudents } = req.body;
	if (!professorId || !startTime || !endTime || !maxStudents) return res.status(400).json('Bad Request');

	const today = new Date().getTime();

	// check if startTime and endTime is valid
	if (!(startTime < endTime || endTime < today)) return res.status(400).json('Bad request: date problem');

	// check if maxStudents is not 0
	if (maxStudents < 0) return res.status(400).json('Bad request: incorrect max students');

	try {
		const session = await createRegistrationSession({ professorId, startTime, endTime, maxStudents });
		return res.status(201).json(session);
	} catch (e) {
		return res.status(500).json(e.message);
	}
});

export default registerSessionRoutes;
