import env from 'dotenv';
import mysql from 'mysql2/promise.js';
import MainRequest from './MainRequest.js';
import PreRequest from './PreRequest.js';
import Professor from './Professor.js';
import RegistrationSession from './RegistrationSession.js';
import Student from './Student.js';

env.config();

function createDB() {
	let conn;

	mysql
		.createConnection({
			user: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
		})
		.then((connection) => {
			conn = connection;
			return connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);
		})
		.then(() => {
			return conn.end();
		})
		.catch((err) => {
			console.warn(err.stack);
		});
}

function configFK() {
	Professor.hasMany(Student, { foreignKey: 'professorId' });
	Student.belongsTo(Professor, { foreignKey: 'assignedProfessorId' });

	Student.hasMany(PreRequest, { foreignKey: 'studentId' });
	PreRequest.belongsTo(Student, { foreignKey: 'studentId' });

	RegistrationSession.hasMany(PreRequest, { foreignKey: 'sessionId' });
	PreRequest.belongsTo(RegistrationSession, { foreignKey: 'sessionId' });

	Professor.hasMany(RegistrationSession, { foreignKey: 'professorId' });
	RegistrationSession.belongsTo(Professor, { foreignKey: 'professorId' });

	Professor.hasMany(MainRequest, { foreignKey: 'professorId' });
	MainRequest.belongsTo(Professor, { foreignKey: 'professorId' });

	Student.hasOne(MainRequest, { foreignKey: 'studentId' });
	MainRequest.belongsTo(Student, { foreignKey: 'studentId' });
}

function initDB() {
	createDB();
	configFK();
}

export default initDB;
