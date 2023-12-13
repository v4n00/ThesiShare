import { Sequelize } from 'sequelize';
import db from '../configDB.js';

const Professor = db.define('Professor', {
	professorId: {
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
});

export async function createProfessor(professor) {
	let duplicateProfessor;
	try {
		duplicateProfessor = await getProfessorByEmail(professor.email);
	} catch (e) {
		await Professor.create(professor);
	}
	if (duplicateProfessor) throw new Error('Professor already exists');
}

export async function getProfessorById(id) {
	const professor = await Professor.findByPk(id);
	if (!professor) throw new Error('Professor not found');

	return professor;
}

export async function getProfessorByEmail(email) {
	const professor = await Professor.findOne({
		where: { email },
	});
	if (!professor) throw new Error('Professor email not found');

	return professor;
}

export async function getProfessorByEmailAndPassword(email, password) {
	try {
		const professor = await getProfessorByEmail(email);

		if (professor.password !== password) throw new Error('Professor password does not match');

		return professor;
	} catch (e) {
		throw e;
	}
}

export async function deleteProfessorById(id) {
	const professor = await getProfessorById(id);
	await Professor.destroy();
}

export default Professor;
