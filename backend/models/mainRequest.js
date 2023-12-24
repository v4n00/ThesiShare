import { Sequelize } from 'sequelize';
import db from '../config/database.js';
import professor from './professor.js';
import student from './student.js';
import { getUserById } from './user.js';

const mainRequest = db.define('MainRequest', {
	mainRequestId: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	studentFilePath: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	professorFilePath: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	studentId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	professorId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	status: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

export default mainRequest;

export async function acceptMainRequest(id) {
	try {
		let request = await getMainRequestById(id);

		request.status = 'accepted';
		return await request.save();
	} catch (e) {
		throw e;
	}
}

export async function rejectMainRequest(id) {
	try {
		let request = await getMainRequestById(id);

		request.status = 'rejected';
		return await request.save();
	} catch (e) {
		throw e;
	}
}

export async function getMainRequestsByProfessorId(id) {
	let request = await mainRequest.findAll({
		where: {
			professorId: id,
		},
	});
	if (!request) throw new Error('Main request not found');
	return request;
}

export async function getMainRequestByStudentId(id) {
	let request = await mainRequest.findOne({
		where: {
			studentId: id,
		},
	});
	if (!request) throw new Error('Main request not found');
	return request;
}

export async function getMainRequestById(id) {
	let request = await mainRequest.findByPk(id);
	if (!request) throw new Error('Main request not found');
	return request;
}

export async function updateMainRequestWithProfessorFile({ professorFilePath, id }) {
	try {
		let request = await mainRequest.findByPk(id);

		if (!request) {
		throw new Error('Main request not found');
		}

		request.professorFilePath = professorFilePath;

		await request.save();

		return request;
	} catch (error) {
		throw error;
	}
}

export async function updateMainRequestWithStudentFile({ studentFilePath, id }) {
	try {
		let request = await mainRequest.findByPk(id);

		if (!request) {
		throw new Error('Main request not found');
		}

		request.studentFilePath = studentFilePath;

		await request.save();

		return request;
	} catch (error) {
		throw error;
	}
}

export async function createMainRequest(request) {
	const { studentFilePath, studentId, professorId } = request;

	let status = 'pending';

	// check if studentId and professorId exist
	try {
		await getUserById(student, studentId);
		await getUserById(professor, professorId);
	} catch (e) {
		throw new Error(e.message);
	}


	// check for duplicate session
	let duplicateSession = await mainRequest.findOne({
		where: {
			studentId: studentId,
			professorId: professorId,
		},
	});
	if (duplicateSession) throw new Error('A main request for the users already exists');

	return await mainRequest.create({ studentFilePath, studentId, professorId, status });
}
