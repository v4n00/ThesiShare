import env from 'dotenv';
import express from 'express';
import initDB from './entities/initDB.js';
import resetDB from './routes/resetDB.js';

let app = express();
env.config();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

initDB();

app.use('/api', resetDB);

let port = process.env.PORT || 8000;
app.listen(port);
console.log(`Backend is running at http://localhost:${port}/`);
