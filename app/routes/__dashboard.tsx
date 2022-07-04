import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout/Layout";
import { getUser } from "~/utils/auth.server";
import {
	getAccounts,
	getActions,
	getPerson,
	getTagsStatus,
} from "~/utils/data.server";
import type { AccountModel } from "~/utils/models";

export const loader: LoaderFunction = async ({ request }) => {
	const { user } = await getUser(request);

	if (user) {
		const [
			{ data: person },
			{ data: accounts },
			{ data: holidays },
			{ tags, status },
			{ data: actions },
		] = await Promise.all([
			getPerson(user.id), // Dados do Usuário
			getAccounts(user.id), // Todas as contas reacionadas a esse usuário
			getActions(), // Ações sem Cliente / Datas Comemorativas
			getTagsStatus(), //Tags & Status
			getActions(user.id), //Ações do mês
			//Campanhas
		]);

		return { user, person, accounts, holidays, tags, status, actions };
	}

	return redirect("/login");
};

export default function Index() {
	const { accounts }: { accounts: AccountModel[] } = useLoaderData();
	return (
		<Layout>
			<Outlet context={{ accounts }} />
		</Layout>
	);
}
