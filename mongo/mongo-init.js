db.auth('admin-user', 'admin-password');

db = db.getSiblingDB('admin');

db.createUser({
	user: 'test-user',
	pwd: 'test-password',
	roles: [
		{
			role: 'root',
			db: 'admin',
		},
	],
});
