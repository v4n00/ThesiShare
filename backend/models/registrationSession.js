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

	if (duplicateSession) throw new Error('A registration session in the same timeframe already exists.');
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
				attributes: ['professorName'],
				where: {},
			},
		],
	});

	if (activeSessions.length === 0) throw new Error('No active registrations found');
	return activeSessions;
}
