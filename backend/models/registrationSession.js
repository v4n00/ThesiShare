import { Sequelize } from 'sequelize';
import db from '../config/database.js';
import professor from './professor.js';

const registrationSession = db.define('RegistrationSession', {
	sessionId: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	professorId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	startTime: {
		type: Sequelize.DATE,
		allowNull: false,
	},
	endTime: {
		type: Sequelize.DATE,
		allowNull: false,
	},
	currentStudents: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	maxStudents: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
});

export default registrationSession;

export async function getRegistrationSessionById(id) {
	const session = await registrationSession.findByPk(id);
	if (!session) throw new Error('Registration Session not found');

	return session;
}

export async function getRegistrationSessionByProfessorId(id) {
	const today = new Date();
	const session = await registrationSession.findOne({
		where: {
			professorId: id,
			startTime: {
				[Sequelize.Op.lt]: today,
			},
			endTime: {
				[Sequelize.Op.gt]: today,
			},
		},
	});

	if (!session) throw new Error('Professor does not have registration');
	return session;
}

export async function createRegistrationSession(session) {
	const { professorId, startTime, endTime, maxStudents } = session;
	const currentStudents = 0;
	const duplicateSession = await registrationSession.findOne({
		where: {
			professorId: professorId,
			startTime: {
				[Sequelize.Op.lt]: new Date(endTime),
			},
			endTime: {
				[Sequelize.Op.gt]: new Date(startTime),
			},
		},
	});

	if (duplicateSession) throw new Error('A registration session in the same timeframe already exists');
	try {
		return await registrationSession.create({ professorId, startTime, endTime, currentStudents, maxStudents });
	} catch (e) {
		throw e;
	}
}

export async function getAllActiveRegistrationSessions() {
	const today = new Date();
	const activeSessions = await registrationSession.findAll({
		where: {
			startTime: {
				[Sequelize.Op.lte]: today,
			},
			endTime: {
				[Sequelize.Op.gte]: today,
			},
		},
		include: [
			{
				model: professor,
				attributes: ['name'],
			},
		],
	});

	if (activeSessions.length === 0) throw new Error('No active registrations found');
	return activeSessions;
}

export async function getAllRegistrationSessionByProfessorId(id) {
    const sessions = await registrationSession.findAll({
        where: {
            professorId: id,
        },
    });

    if (sessions.length === 0) throw new Error('Professor does not have registration');
    return sessions;
}

export async function verifyRegistrationSessionHasSlots(sessionId) {
	let session = await getRegistrationSessionById(sessionId);
	if (session.dataValues.currentStudents >= session.dataValues.maxStudents) throw new Error('Session is full');

	return true;
}
