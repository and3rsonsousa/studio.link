export type PersonModel = {
	id: string;
	name: string;
	email: string;
	admin: Boolean;
	user: string;
};

export type UserModel = {
	id: string;
	email?: string;
};

export type AccountModel = {
	id: string;
	name: string;
	slug: string;
	users: string[];
};
