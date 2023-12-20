import cors from 'cors';
import express from 'express';
import { PORT } from './config/const.js';
import initDatabase from './config/initDatabase.js';
import accountRoutes from './routes/accountRoutes.js';
import mainRequestRoutes from './routes/mainRequestRoutes.js';
import preRequestRoutes from './routes/preRequestRoutes.js';
import registerSessionRoutes from './routes/registerSessionRoutes.js';

// configuration
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
app.use('/api', mainRequestRoutes);

// start the server
app.listen(PORT, () => {
	console.log(`Backend is running at http://localhost:${PORT}/`);
});
