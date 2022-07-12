import type {
	ActionFunction,
	LoaderFunction,
	MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CalendarView } from "~/components/Layout/CalendarView";
import { getUser } from "~/utils/auth.server";
import {
	getActions,
	getCampaigns,
	getPersons,
	handleAction,
} from "~/utils/data.server";

export const meta: MetaFunction = () => ({
	title: "Dashboard > STUDIO",
});

export const loader: LoaderFunction = async ({ request }) => {
	const { user } = await getUser(request);

	const url = new URL(request.url);
	const date = url.searchParams.get("date");

	const [
		// { data: persons },
		{ data: holidays },
		{ data: actions },
		{ data: campaigns },
	] = await Promise.all([
		//getPersons(), // Dados dos pessoas
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
		holidays,
		actions,
		campaigns,
	};
};

export default function () {
	const { holidays, actions, campaigns } = useLoaderData();

	return <CalendarView actions={actions} holidays={holidays} />;
}

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	return handleAction(formData);
};
