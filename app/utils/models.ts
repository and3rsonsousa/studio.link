import { Dayjs } from "dayjs";

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

export type ActionModel = {
	id: string;
	name: string;
	date: string;
	account?: string;
	tag?: string;
	status?: string;
	description?: string;
	date_end?: string;
	created_at?: string;
	updated_at?: string;
};

export type ActionModelFull = {
	id: string;
	name: string;
	date: string;
	account?: string;
	tag: ItemModel;
	status: ItemModel;
	description?: string;
	date_end?: string;
	created_at?: string;
	updated_at?: string;
};

export type ItemModel = {
	id: string;
	name: string;
	slug: string;
};

export type DayModel = {
	date: Dayjs;
	holidays: ActionModel[];
	actions: ActionModel[];
};

export type DropdownOptions = Array<
	{ id: string; text: string; href: string } | "divider" | (() => {})
>;
