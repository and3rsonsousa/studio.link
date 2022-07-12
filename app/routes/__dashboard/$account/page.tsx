import type {
	ActionFunction,
	LoaderFunction,
	MetaFunction,
} from "@remix-run/node";
import { Outlet, useLoaderData, useMatches } from "@remix-run/react";
import { CalendarView } from "~/components/Layout/CalendarView";
import {
	getAccount,
	getActions,
	getCampaigns,
	handleAction,
} from "~/utils/data.server";
import type { AccountModel } from "~/utils/models";

export const meta: MetaFunction = ({ data, parentsData }) => {
	const { account }: { account: AccountModel } = data;
	return {
		title: `${account.name} > STUDIO`,
	};
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const url = new URL(request.url);
	const date = url.searchParams.get("date");

	const [
		{ data: account },
		{ data: holidays },
		{ data: actions },
		{ data: campaigns },
	] = await Promise.all([
		getAccount({ slug: params.account }),
		getActions({
			period: date || undefined,
			holidays: true,
		}), //  Datas Comemorativas
		getActions({
			account: params.account,
			period: date || undefined,
		}), //Ações do mês - TODO: Filtrar por mês
		getCampaigns(params.account as string), //Campanhas
	]);

	return {
		account,
		holidays,
		actions,
		campaigns,
	};
};

export default function AccountPage() {
	const { actions, holidays } = useLoaderData();
	const matches = useMatches();

	return (
		<div className="flex h-full gap-8">
			<div className={`h-full${matches.length > 4 ? " w-2/3" : ""}`}>
				<CalendarView actions={actions} holidays={holidays} />
			</div>
			<Outlet />
		</div>
	);
}

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	return handleAction(formData);
};
