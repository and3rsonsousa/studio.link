import { supabaseClient } from "./supabase";

export const getPerson = (id: string) =>
	supabaseClient.from("Person").select("*").eq("user", id).single();

export const getAccounts = (user: string) =>
	supabaseClient
		.from("Account")
		.select("*")
		.contains("users", [user])
		.order("name", {
			ascending: true,
		});

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

export const getTagsStatus = async () => {
	const [{ data: tags }, { data: status }] = await Promise.all([
		supabaseClient
			.from("Tag")
			.select("*")
			.order("name", { ascending: true }),
		supabaseClient.from("Status").select("*"),
	]);

	return { tags, status };
};

export const getActions = async (user?: string) => {
	let { data, error } = await supabaseClient
		.from("Action")
		.select("*")
		.order("date", {
			ascending: true,
		})
		.order("created_at", { ascending: true });

	if (error) {
		return { error };
	}

	return { data };
};

export async function createAction(formData: FormData) {
	// console.log(Object.fromEntries(formData));

	// return false;

	const name = formData.get("name") as string;
	const date = formData.get("date") as string;
	const account = formData.get("account") as string;
	const description = (formData.get("description") as string) || null;
	const date_end = (formData.get("date_end") as string) || null;
	const tag = formData.get("tag") as string;
	const status = formData.get("status") as string;
	const creator = formData.get("creator") as string;
	const responsible = formData.get("responsible") as string;
	const campaign = (formData.get("campaign") as string) || null;

	if (account) {
		const { data: action, error } = await supabaseClient
			.from("Action")
			.insert([
				{
					name,
					description,
					date,
					date_end,
					tag,
					status,
					account,
					creator,
					responsible,
					campaign,
				},
			]);

		if (error) return { error };

		return action;
	} else {
		const { data: action, error } = await supabaseClient
			.from("Action")
			.insert([
				{
					name,
					date,
				},
			]);

		if (error) return { error };

		return action;
	}
}
