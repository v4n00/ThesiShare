import { Sequelize } from 'sequelize';
import db from '../config/database.js';
import { getRegistrationSessionById, getRegistrationSessionByProfessorId } from './registrationSession.js';
import student from './student.js';
import { getUserById } from './user.js';

const preRequest = db.define('PreRequest', {
	preRequestId: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	studentId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	sessionId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	status: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	justification: {
		type: Sequelize.STRING,
		allowNull: true,
	},
});

export default preRequest;

export async function getPreRequestsFromRegistrationSessionByProfessorId(id) {
	try {
		let session = await getRegistrationSessionByProfessorId(id);
		let requests = await getAllPreRequestsBySessionId(session.dataValues.sessionId);
		return requests;
	} catch (e) {
		throw e;
	}
}

export async function getAllPreRequestsBySessionId(id) {
	const requests = await preRequest.findAll({
		where: {
			sessionId: id,
		},
	});
	return requests;
}

export async function getPreRequestById(id) {
	const request = await preRequest.findByPk(id);
	if (!request) throw new Error('PreRequest not found');

	return request;
}

export async function createPreRequest(request) {
	const { studentId, sessionId, title } = request;

	let status = 'pending';
	let foundStudent;
	let foundSession;

	// check if studentId and sessionId exist
	try {
		foundSession = (await getRegistrationSessionById(sessionId)).dataValues;
		foundStudent = (await getUserById(student, studentId)).dataValues;
	} catch (e) {
		throw new Error(e.message);
	}

	// check if student already has professor
	if (foundStudent.assignedProfessorId) throw new Error('Student already has an assigned professor');

	// check if student already has a prerequest to the professor
	let duplicatePreRequest = preRequest.findOne({
		where: {
			studentId: foundStudent.studentId,
			sessionId: foundSession.sessionId,
		},
	});
	if (duplicatePreRequest) throw new Error('Student already sent a prerequest to this session');

	try {
		return await preRequest.create({ studentId, sessionId, status, title });
	} catch (e) {
		throw e;
	}
}
