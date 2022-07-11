import type {
	ActionFunction,
	LoaderFunction,
	MetaFunction,
} from "@remix-run/node";
import { CalendarView } from "~/components/Layout/CalendarView";
import { getUser } from "~/utils/auth.server";
import {
	createAction,
	deleteAction,
	getActions,
	getCampaigns,
	getPersons,
	updateAction,
} from "~/utils/data.server";

export const meta: MetaFunction = () => ({
	title: "Dashboard > STUDIO",
});

export const loader: LoaderFunction = async ({ request }) => {
	const { user } = await getUser(request);

	const url = new URL(request.url);
	const date = url.searchParams.get("date");

	const [
		{ data: persons },
		{ data: holidays },
		{ data: actions },
		{ data: campaigns },
	] = await Promise.all([
		getPersons(), // Dados dos pessoas
		getActions({
			period: date || undefined,
			holidays: true,
		}), //  Datas Comemorativas
		getActions({
			user: user?.id,
			period: date || undefined,
		}), //Ações do mês - TODO: Filtrar por mês
		getCampaigns(), //Campanhas
	]);

	return {
		persons,
		holidays,
		actions,
		campaigns,
	};
};

export default function () {
	return <CalendarView />;
}

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
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
