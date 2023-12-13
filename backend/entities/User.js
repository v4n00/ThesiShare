// This class is used as the method to access both the Professor and Student table
// When calling a method from this file, specify the 'model' argument as the model name
// example: getUserById(Professor, 5);
// WARNING: you have to import both the Professor.js model and the User.js methods
// For an example, please check out accountRoutes.js

export async function createUser(model, user) {
	let duplicateUser;

	// check duplicate user, if exists, do not add to database
	try {
		duplicateUser = await getUserByEmail(model, user.email);
	} catch (e) {
		await model.create(user);
	}

	if (duplicateUser) throw new Error(`${model.name} already exists`);
}

export async function getUserById(model, id) {
	const user = await model.findByPk(id);
	if (!user) throw new Error(`${model.name} not found`);

	return user;
}

export async function getUserByEmailAndCheckPassword(model, email, password) {
	try {
		const user = await getUserByEmail(model, email);

		if (user.password !== password) throw new Error(`${model.name} password does not match`);
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
