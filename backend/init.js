import db from './config/database.js';
import mainRequest from './models/mainRequest.js';
import preRequest from './models/preRequest.js';
import professor from './models/professor.js';
import registrationSession from './models/registrationSession.js';
import student from './models/student.js';

// Professor to Student - Many-to-One relationship
professor.hasMany(student, { foreignKey: 'assignedProfessorId' });
student.belongsTo(professor, { foreignKey: 'assignedProfessorId' });

// Student to PreRequest - Many-to-One relationship
student.hasMany(preRequest, { foreignKey: 'studentId' });
preRequest.belongsTo(student, { foreignKey: 'studentId' });

// RegistrationSession to PreRequest - Many-to-One relationship
registrationSession.hasMany(preRequest, { foreignKey: 'sessionId' });
preRequest.belongsTo(registrationSession, { foreignKey: 'sessionId' });

// Professor to RegistrationSession - Many-to-One relationship
professor.hasMany(registrationSession, { foreignKey: 'professorId' });
registrationSession.belongsTo(professor, { foreignKey: 'professorId' });

// Professor to MainRequest - Many-to-One relationship
professor.hasMany(mainRequest, { foreignKey: 'professorId' });
mainRequest.belongsTo(professor, { foreignKey: 'professorId' });

// Student to MainRequest - One-to-One relationship
student.hasOne(mainRequest, { foreignKey: 'studentId' });
mainRequest.belongsTo(student, { foreignKey: 'studentId' });

(async () => {
	try {
		await db.sync({ force: true });
		console.log('Database and tables created');
	} catch (err) {
		console.warn(err.stack);
	}
})();
