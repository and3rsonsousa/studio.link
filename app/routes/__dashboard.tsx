import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout/Layout";
import { getUser } from "~/utils/auth.server";
import { getAccounts, getPerson, getTagsStatus } from "~/utils/data.server";
import type { AccountModel } from "~/utils/models";

export const loader: LoaderFunction = async ({ request }) => {
	const { user } = await getUser(request);

	if (user) {
		const [{ data: person }, { data: accounts }, { tags, status }] =
			await Promise.all([
				getPerson(user.id), // Dados do Usuário
				getAccounts(user.id), // Todas as contas reacionadas a esse usuário
				getTagsStatus(), //Tags & Status
			]);

		return {
			user,
			person,
			accounts,
			tags,
			status,
		};
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
