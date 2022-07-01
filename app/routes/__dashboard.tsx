import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Layout from "~/components/Layout/Layout";
import { getUser } from "~/utils/auth.server";
import { getAccounts, getPerson } from "~/utils/data";
import type { AccountModel } from "~/utils/models";

export const loader: LoaderFunction = async ({ request }) => {
	const { user } = await getUser(request);

	if (user) {
		const [{ data: person }, { data: accounts }] = await Promise.all([
			getPerson(user.id),
			getAccounts(user.id),
		]);

		return { user, person, accounts };
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
