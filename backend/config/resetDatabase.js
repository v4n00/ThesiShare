import db from './database.js';
import initDatabase from './initDatabase.js';

initDatabase();

(async () => {
	try {
		await db.sync({ force: true });
		console.log('Database and tables restored');
	} catch (err) {
		console.warn(err.stack);
	}
})();
