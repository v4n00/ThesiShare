import { Sequelize } from 'sequelize';
import db from '../configDB.js';

const Student = db.define('Student', {
	studentId: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	assignedProfessorId: {
		type: Sequelize.INTEGER,
		allowNull: true,
	},
});

export default Student;
