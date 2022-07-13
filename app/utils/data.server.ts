import dayjs from "dayjs";
import { supabaseClient } from "./supabase";

export const getPerson = (id: string) =>
	supabaseClient.from("Person").select("*").eq("user", id).single();

export const getPersons = () =>
	supabaseClient
		.from("Person")
		.select("*")
		.order("name", { ascending: true });

export const getAccount = async (args: { id?: string; slug?: string } = {}) => {
	const { id, slug } = args;
	if (id) {
		return supabaseClient.from("Account").select("*").eq("id", id).single();
	}
	return supabaseClient.from("Account").select("*").eq("slug", slug).single();
};

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
			users,
		})
		.eq("id", id);

	if (error) {
		return { error };
	}

	return { data };
};

export const getCampaigns = (account: string) => {
	return supabaseClient
		.from("Campaign")
		.select("*, Account!inner(*)")
		.eq("Account.slug", account)
		.order("date");
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

export const getActions = async (
	args: {
		user?: string;
		account?: string;
		period?: string;
		holidays?: true;
	} = {}
) => {
	let { user, account, period, holidays } = args;

	let _period = dayjs();

	if (period) {
		_period = dayjs(period);
	}

	let firstDay = _period.startOf("month").startOf("week");
	let lastDay = _period.endOf("month").endOf("week").add(1, "day");

	if (holidays) {
		let { data, error } = await supabaseClient
			.from("Action")
			.select("*")
			.gte("date", firstDay.format("YYYY-MM-DD"))
			.lt("date", lastDay.format("YYYY-MM-DD"))
			.is("account", null)
			.order("date", {
				ascending: true,
			})
			.order("created_at", { ascending: true });

		if (error) {
			return { error };
		}

		return { data };
	} else {
		if (account) {
			return supabaseClient
				.from("Action")
				.select("*, Account!inner(*)")
				.eq("Account.slug", account)
				.gte("date", firstDay.format("YYYY-MM-DD"))
				.lt("date", lastDay.format("YYYY-MM-DD"))
				.order("date", {
					ascending: true,
				})
				.order("created_at", { ascending: true });
		} else {
			return supabaseClient
				.from("Action")
				.select("*, Account!inner(*)")
				.contains("Account.users", [user])
				.gte("date", firstDay.format("YYYY-MM-DD"))
				.lt("date", lastDay.format("YYYY-MM-DD"))
				.filter("account", "not.is", null)
				.order("date", {
					ascending: true,
				})
				.order("created_at", { ascending: true });
		}
	}
};

export const getAction = (id?: string) => {
	return supabaseClient
		.from("Action")
		.select(
			"*, account:Account(*), status(*), tag:Tag(*), creator:Action_creator_fkey(*), responsible:Action_responsible_fkey(*),campaign:Campaign(*), tasks:Task(*)"
		)
		.eq("id", id)
		.single();
};

export async function createAction(formData: FormData) {
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

export async function updateAction(
	id: string,
	values: {
		name?: string;
		date?: string;
		account?: string;
		description?: string;
		tag?: string;
		status?: string;
		responsible?: string;
		campaign?: string;
		date_end?: string;
	}
) {
	const { data, error } = await supabaseClient
		.from("Action")
		.update(values)
		.eq("id", id);

	return { data, error };
}

export async function deleteAction(id: string) {
	const { data, error } = await supabaseClient
		.from("Action")
		.delete()
		.eq("id", id);

	return { data, error };
}

export const handleAction = async (formData: FormData) => {
	const action = formData.get("action") as string;

	if (action === "create-action") {
		return await createAction(formData);
	} else if (action.match(/update-/)) {
		const id = formData.get("id") as string;
		let values = {};
		if (action === "update-tag") {
			values = { tag: formData.get("tag") as string };
		} else if (action === "update-status") {
			values = { status: formData.get("status") as string };
		} else if (action === "update-date") {
			values = { date: formData.get("date") as string };
		}
		return await updateAction(id, values);
	} else if (action === "delete-action") {
		const id = formData.get("id") as string;
		return await deleteAction(id);
	}

	return {
		error: { message: "No matched action" },
	};
};
