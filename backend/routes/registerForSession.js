import express from 'express';
import { createRegistrationSession, getAllActiveRegistrationSessions } from '../models/registrationSession.js';

const registerSession = express.Router();

registerSession.route('/registration-session/').get(async (req, res) => {
	// returns an array of sessions that are active as of today's date
	// also return the name of the professor
	// [
	//     {
	//         "sessionId": 3,
	//         "professorId": 1,
	//         "professorName": "test",
	//         "startTime": "2021-12-14T10:46:48.000Z",
	//         "endTime": "2025-12-14T10:46:48.000Z",
	//         "currentStudents": 0,
	//         "maxStudents": 5
	//     }
	// ]
	function modelAssociationsToArray(model) {
		const result = [];

		if (typeof model !== 'object' || typeof model.associations !== 'object') {
			throw new Error("Model should be an object with the 'associations' property.");
		}

		Object.keys(model.associations).forEach((key) => {
			const association = {};

			// all needed information in the 'options' object
			if (model.associations[key].hasOwnProperty('options')) {
				association[key] = model.associations[key].options;
			}

			result.push(association);
		});

		return result;
	}
	console.log(modelAssociationsToArray(registerSession));

	try {
		const sessions = await getAllActiveRegistrationSessions();
		return res.status(200).json(sessions);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

registerSession.route('/registration-session/').post(async (req, res) => {
	// request body should have these 4 parameters
	// professorId - int
	// startTime - int, unix time in milliseconds
	// endTime - int, unix time in milliseconds
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

export default registerSession;
