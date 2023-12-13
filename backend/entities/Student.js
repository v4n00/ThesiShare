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
		unique: true,
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

export async function createStudent(student) {
	let duplicateStudent;
	try {
		duplicateStudent = await getStudentByEmail(student.email);
	} catch (e) {
		await Student.create(student);
	}
	if (duplicateStudent) throw new Error('Student already exists');
}

export async function getStudentById(id) {
	const student = await Student.findByPk(id);
	if (!student) throw new Error('Student not found');

	return student;
}

export async function getStudentByEmail(email) {
	const student = await Student.findOne({
		where: { email },
	});
	if (!student) throw new Error('Student email not found');

	return student;
}

export async function getStudentByEmailAndPassword(email, password) {
	try {
		const student = await getStudentByEmail(email);

		if (student.password !== password) throw new Error('Student password does not match');

		return student;
	} catch (e) {
		throw e;
	}
}

export async function deleteStudentById(id) {
	const student = await getStudentById(id);
	await student.destroy();
}

export default Student;
