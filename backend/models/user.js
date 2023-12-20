import bcrypt from 'bcrypt';
// This class is used as the method to access both the Professor and Student table
// When calling a method from this file, specify the 'model' argument as the model name
// example: getUserById(Professor, 5);
// WARNING: you have to import both the Professor.js model and the User.js methods
// For an example, please check out accountRoutes.js

export async function createUser(model, user) {
	// check duplicate user, if exists, do not add to database
	const duplicateUser = await model.findOne({ where: { email: user.email } });
	if (duplicateUser) throw new Error(`${model.name} already exists`);

	return await model.create(user);
}

export async function getUserById(model, id) {
	const user = await model.findByPk(id);
	if (!user) throw new Error(`${model.name} not found with id ${id}`);

	return user;
}

export async function getUserByEmailAndCheckPassword(model, email, password) {
	try {
		const user = await getUserByEmail(model, email);

		// check hashed password
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) throw new Error(`${model.name} password does not match`);

		return user;
	} catch (e) {
		throw e;
	}
}

export async function getUserByEmail(model, email) {
	const user = await model.findOne({ where: { email } });
	if (!user) throw new Error(`${model.name} email not found`);

	return user;
}

export async function deleteUserById(model, id) {
	const user = await getUserById(model, id);
	await user.destroy();
}
