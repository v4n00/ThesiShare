import express from 'express';
import { acceptMainRequest, createMainRequest, getMainRequestById, getMainRequestByStudentId, getMainRequestsByProfessorId, rejectMainRequest } from '../models/mainRequest.js';

const mainRequestRoutes = express.Router();

// IMPORTANT:
// mainRequest status can be:
// 'pending'
// 'accepted'
// 'rejected'

// accept a mainrequest
mainRequestRoutes.route('/mainrequest/accept').put(async (req, res) => {
	// returns the mainRequest data
	// request body should have this parameter
	// requestId - int
	// the request should contain this file
	// file - pdf
	const { requestId } = req.body;

	let professorFilePath = req.file.path;
	if (!requestId || !req.file) return res.status(400).json('Bad Request');

	// let professorFilePath = 'test';
	// if (!requestId) return res.status(400).json('Bad Request');

	try {
		let request = await acceptMainRequest(requestId, professorFilePath);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// reject a mainrequest
mainRequestRoutes.route('/mainrequest/reject').put(async (req, res) => {
	// returns the mainRequest data
	// request body should have these 1 parameter
	// requestId - int
	const { requestId } = req.body;
	if (!requestId) return res.status(400).json('Bad Request');

	try {
		let request = await rejectMainRequest(requestId);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// get mainRequest for given studentId
mainRequestRoutes.route('/mainrequest/student/:studentId').get(async (req, res) => {
	// returns the mainRequest data for a student id
	// request params should have 1 parameter
	// studentId - int
	const studentId = req.params.studentId;
	if (!studentId) return res.status(400).json('Bad Request');

	try {
		let request = await getMainRequestByStudentId(studentId);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// get all mainRequests for a given professor id
mainRequestRoutes.route('/mainrequest/professor/:professorId').get(async (req, res) => {
	// returns all mainRequests (array) for a given professor id
	// request params should have 1 parameter
	// professorId - int
	const professorId = req.params.professorId;
	if (!professorId) return res.status(400).json('Bad Request');

	try {
		let requests = await getMainRequestsByProfessorId(professorId);
		return res.status(200).json(requests);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// get mainRequest by id
mainRequestRoutes.route('/mainrequest/:requestId').get(async (req, res) => {
	// returns the mainRequest data
	// request params should have 1 parameter
	// requestId - int
	const requestId = req.params.requestId;
	if (!requestId) return res.status(400).json('Bad Request');

	try {
		let request = await getMainRequestById(requestId);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// create main request
mainRequestRoutes.route('/mainrequest').post(async (req, res) => {
	// returns the mainRequest data
	// request body should have these 3 parameters
	// studentId - int
	// professorId - int
	// the request should contain this file
	// file - pdf
	const { studentId, professorId } = req.body;

	let studentFilePath = req.file.path;
	if (!studentId || !professorId || !req.file) return res.status(400).json('Bad Request');

	// let studentFilePath = 'test';
	// if (!studentId || !professorId) return res.status(400).json('Bad Request');

	try {
		let request = await createMainRequest({ studentFilePath, studentId, professorId });
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

export default mainRequestRoutes;
