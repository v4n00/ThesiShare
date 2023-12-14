import express from 'express';
import initDatabase from './config/initDatabase.js';
import accounts from './routes/accounts.js';
import registerSession from './routes/registerForSession.js';

// configuration
let port = 8080;
let app = express();
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// init db
initDatabase();

// link routers
app.use('/api', accounts);
app.use('/api', registerSession);

// start the server
app.listen(port);
console.log(`Backend is running at http://localhost:${port}/`);
