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

// configure foreign keys
function configFK() {
	// Professor to Student - Many-to-One relationship
	Professor.hasMany(Student, { foreignKey: 'professorId' });
	Student.belongsTo(Professor, { foreignKey: 'assignedProfessorId' });

	// Student to PreRequest - Many-to-One relationship
	Student.hasMany(PreRequest, { foreignKey: 'studentId' });
	PreRequest.belongsTo(Student, { foreignKey: 'studentId' });

	// RegistrationSession to PreRequest - Many-to-One relationship
	RegistrationSession.hasMany(PreRequest, { foreignKey: 'sessionId' });
	PreRequest.belongsTo(RegistrationSession, { foreignKey: 'sessionId' });

	// Professor to RegistrationSession - Many-to-One relationship
	Professor.hasMany(RegistrationSession, { foreignKey: 'professorId' });
	RegistrationSession.belongsTo(Professor, { foreignKey: 'professorId' });

	// Professor to MainRequest - Many-to-One relationship
	Professor.hasMany(MainRequest, { foreignKey: 'professorId' });
	MainRequest.belongsTo(Professor, { foreignKey: 'professorId' });

	// Student to MainRequest - One-to-One relationship
	Student.hasOne(MainRequest, { foreignKey: 'studentId' });
	MainRequest.belongsTo(Student, { foreignKey: 'studentId' });
}

function initDB() {
	createDB();
	configFK();
}

export default initDB;
