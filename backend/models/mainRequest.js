import { Sequelize } from 'sequelize';
import db from '../config/database.js';

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
