import multer from 'multer';
import path from 'path';

// setup storage for student PDFs
const studentStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/student');
	},
	filename: function (req, file, cb) {
		cb(null, 'student-' + Date.now() + path.extname(file.originalname));
	},
});

// setup storage for professor PDFs
const professorStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/professor');
	},
	filename: function (req, file, cb) {
		cb(null, 'professor-' + Date.now() + path.extname(file.originalname));
	},
});

export const uploadStudent = multer({ storage: studentStorage });
export const uploadProfessor = multer({ storage: professorStorage });
