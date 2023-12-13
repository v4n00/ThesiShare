import { Sequelize } from 'sequelize';
import db from '../config/database.js';

// THIS CLASS ONLY HAS THE MODEL
// If you want to access methods for this class, use the methods inside User.js
// and for the 'model' argument specify the object defined below

const professor = db.define('Professor', {
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

export default professor;
