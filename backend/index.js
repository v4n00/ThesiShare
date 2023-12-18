import cors from 'cors';
import express from 'express';
import initDatabase from './config/initDatabase.js';
import accountRoutes from './routes/accountRoutes.js';
import preRequestRoutes from './routes/preRequestRoutes.js';
import registerSessionRoutes from './routes/registerSessionRoutes.js';

// configuration
let port = 8080;
let app = express();
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(
	cors({
		origin: '*',
	})
);

// init db
initDatabase();

// link routers
app.use('/api', accountRoutes);
app.use('/api', registerSessionRoutes);
app.use('/api', preRequestRoutes);

// start the server
app.listen(port);
console.log(`Backend is running at http://localhost:${port}/`);
