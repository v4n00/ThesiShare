import env from 'dotenv';
import express from 'express';
import initDB from './entities/initDB.js';
import accountsRoutes from './routes/accountRoutes.js';
import resetDB from './routes/resetDB.js';

// configuration
let app = express();
env.config();
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// warning to add .env file
if (!process.env.PORT) {
	console.error('ERROR: You are missing the .env file\nRefer to example.env for an example configuration');
	process.exit(1);
}

// set up everything
initDB();
app.use('/api', resetDB);
app.use('/api', accountsRoutes);

// start the server
let port = process.env.PORT;
app.listen(port);
console.log(`Backend is running at http://localhost:${port}/`);
