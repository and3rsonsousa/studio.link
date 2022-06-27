import { supabaseClient } from "./supabase";

export const getPerson = (id: string) =>
	supabaseClient.from("Person").select("*").eq("user", id).single();

export const getAccounts = (user: string) =>
	supabaseClient.from("Account").select("*").contains("users", [user]);

export const deleteAccount = async (id: string) => {
	let { data, error } = await supabaseClient
		.from("Account")
		.delete()
		.eq("id", id);
	if (error) {
		return error;
	}
	return { data };
};

export const addAccount = async (
	name: string,
	slug: string,
	users: string[]
) => {
	let { data, error } = await supabaseClient.from("Account").insert([
		{
			name,
			slug,
			users,
		},
	]);

	if (error) {
		return { error };
	}

	return { data };
};

export const updateAccount = async (
	id: string,
	name: string,
	slug: string,
	users: string[]
) => {
	console.log({ id, name, slug, users });

	let { data, error } = await supabaseClient
		.from("Account")
		.update({
			id,
			name,
			slug,
		})
		.eq("id", id);

	if (error) {
		return { error };
	}

	return { data };
};
