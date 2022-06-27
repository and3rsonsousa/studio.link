import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Layout from "~/components/Layout/Layout";
import { getUser } from "~/utils/auth.server";
import { getAccounts, getPerson } from "~/utils/data";

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
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
}
