import express from 'express';
import { uploadProfessor, uploadStudent } from '../config/multer.js';
import { verifyProfessor, verifyStudent, verifyToken } from '../middleware/authMiddleware.js';
import { acceptMainRequest, createMainRequest, getMainRequestById, getMainRequestByStudentId, getMainRequestsByProfessorId, rejectMainRequest, updateMainRequestWithProfessorFile, updateMainRequestWithStudentFile } from '../models/mainRequest.js';

const mainRequestRoutes = express.Router();

// IMPORTANT:
// mainRequest status can be:
// 'pending'
// 'accepted'
// 'rejected'

// accept a mainrequest
mainRequestRoutes.route('/mainrequest/accept').put(verifyProfessor, async (req, res) => {
	// returns the mainRequest data
	// request body should have this parameter
	// requestId - int
	const { requestId } = req.body;

	if (!requestId) return res.status(400).json('Bad Request');

	try {
		let request = await acceptMainRequest(requestId);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// reject a mainrequest
mainRequestRoutes.route('/mainrequest/reject').put(verifyProfessor, async (req, res) => {
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
mainRequestRoutes.route('/mainrequest/professor/:professorId').get(verifyProfessor, async (req, res) => {
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
mainRequestRoutes.route('/mainrequest/:requestId').get(verifyToken, async (req, res) => {
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
mainRequestRoutes.route('/mainrequest').post(uploadStudent.single('file'), verifyStudent, async (req, res) => {
	// returns the mainRequest data
	// request body should have these 3 parameters
	// studentId - int
	// professorId - int
	// the request should contain this file
	// file - pdf
	const { studentId, professorId } = req.body;

	let studentFilePath = req.file.path;
	if (!studentId || !professorId || !req.file) return res.status(400).json('Bad Request');

	try {
		let request = await createMainRequest({ studentFilePath, studentId, professorId });
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

mainRequestRoutes.route('/mainrequest/uploadStudentFile/:mainRequestId').put(uploadStudent.single('file'), async (req, res) => {
	// updates the mainRequest with the path to the file signed by the student
	// request body should have this parameter
	// file - pdf

	let studentFilePath = req.file.path;
	const id = req.params.mainRequestId;

	if (!req.file) return res.status(400).json('Bad Request');

	try {
		let request = await updateMainRequestWithStudentFile({ studentFilePath, id });
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

mainRequestRoutes.route('/mainrequest/uploadProfessorFile/:mainRequestId').put(uploadProfessor.single('file'), async (req, res) => {
	// updates the mainRequest with the path to the file signed by the professor
	// request body should have this parameter
	// file - pdf

	let professorFilePath = req.file.path;
	const id = req.params.mainRequestId;

	if (!req.file) return res.status(400).json('Bad Request');

	try {
		let request = await updateMainRequestWithProfessorFile({ professorFilePath, id });
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

mainRequestRoutes.route('/mainrequest/downloadStudentFile/:mainRequestId').get(async (req, res) => {
	// returns the mainRequest data
	// request params should have these 1 parameter
	// mainRequestId - int
	const id = req.params.mainRequestId;
	if (!id) return res.status(400).json('Bad Request');

	try {
		let request = await getMainRequestById(id);
		return res.download(request.studentFilePath);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

mainRequestRoutes.route('/mainrequest/downloadProfessorFile/:mainRequestId').get(async (req, res) => {
	// returns the mainRequest data
	// request params should have these 1 parameter
	// mainRequestId - int
	const id = req.params.mainRequestId;
	if (!id) return res.status(400).json('Bad Request');

	try {
		let request = await getMainRequestById(id);
		return res.download(request.professorFilePath);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

export default mainRequestRoutes;
