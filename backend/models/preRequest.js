import { Sequelize } from 'sequelize';
import db from '../config/database.js';

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
