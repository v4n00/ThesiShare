import { Sequelize } from 'sequelize';
import db from '../config/database.js';

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
