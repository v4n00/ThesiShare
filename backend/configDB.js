import env from 'dotenv';
import Sequelize from 'sequelize';

env.config();

const db = new Sequelize({
	dialect: 'mysql',
	database: 'ThesisDB',
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	logging: false,
	define: {
		timestamps: false,
		freezeTableName: true,
	},
});

export default db;
