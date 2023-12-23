import { Sequelize } from 'sequelize';
import db from '../config/database.js';
import { getRegistrationSessionById, getRegistrationSessionByProfessorId, verifyRegistrationSessionHasSlots } from './registrationSession.js';
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

export async function rejectPreRequest(id, justification) {
	try {
		let request = await getPreRequestById(id);
		if (request.dataValues.status != 'pending') throw new Error('Cannot edit non-pending PreRequest');

		request.status = 'rejected';
		request.justification = justification;
		return await request.save();
	} catch (e) {
		throw e;
	}
}

export async function acceptPreRequest(id) {
	try {
		let request = await getPreRequestById(id);
		if (request.dataValues.status != 'pending') throw new Error('Cannot edit non-pending PreRequest');

		let user = await getUserById(student, request.dataValues.studentId);
		let session = await getRegistrationSessionById(request.dataValues.sessionId);

		// verify that session still has slots
		if (await verifyRegistrationSessionHasSlots(session.dataValues.sessionId)) {
			session.currentStudents += 1;
			await session.save();
		}

		request.status = 'accepted';
		user.assignedProfessorId = session.dataValues.professorId;
		await user.save();
		return await request.save();
	} catch (e) {
		throw e;
	}
}

export async function getPreRequestsByStudentId(id) {
	return await preRequest.findAll({ where: { studentId: id } });
}

export async function getPreRequestsFromRegistrationSessionByProfessorId(id) {
	try {
		let session = await getRegistrationSessionByProfessorId(id);
		let requests = await getPreRequestsBySessionId(session.dataValues.sessionId);
		return requests;
	} catch (e) {
		throw e;
	}
}

export async function getPreRequestsBySessionId(id) {
	const requests = await preRequest.findAll({
		where: {
			sessionId: id,
		},
		include: [
			{
				model: student,
			},
		],
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
		throw e;
	}

	// verify that session still has slots
	try {
		await verifyRegistrationSessionHasSlots(foundSession.sessionId);
	} catch (e) {
		throw e;
	}

	// check if student already has professor
	if (foundStudent.assignedProfessorId) throw new Error('Student already has an assigned professor');

	// check if student already has a prerequest to the professor
	let duplicatePreRequest = await preRequest.findOne({
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
