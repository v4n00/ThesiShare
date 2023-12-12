import express from 'express';

let app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

let port = process.env.PORT || 8000;
app.listen(port);
console.log(`Backend is running at http://localhost:${port}/`);
