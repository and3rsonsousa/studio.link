import type {
	ActionFunction,
	LoaderFunction,
	MetaFunction,
} from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import { Button } from "~/components/Forms";
import { deleteAccount } from "~/utils/data.server";
import type { AccountModel } from "~/utils/models";
import { supabaseClient } from "~/utils/supabase";

export const loader: LoaderFunction = async ({ request }) => {
	const { data: accounts } = await supabaseClient
		.from("Account")
		.select()
		.order("name", {
			ascending: true,
		});
	return { accounts };
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	return deleteAccount(formData.get("id") as string);
};

export const meta: MetaFunction = () => ({
	title: "Accounts > STUDIO",
});

export default function AdminAccountsIndex() {
	const { accounts }: { accounts: AccountModel[] } = useLoaderData();
	return (
		<>
			<div className="border-line flex items-center justify-between py-4">
				<h3 className="text-gray-300">Clientes</h3>
				<div>
					<Link
						to={`./new`}
						className="button flex items-center space-x-2"
					>
						<span>Cadastrar Novo Cliente</span>
						<HiOutlinePlus />
					</Link>
				</div>
			</div>
			<div className="flex gap-8">
				<div className="w-full">
					<div className="">
						{accounts && accounts.length > 0 ? (
							accounts.map((account) => (
								<div
									className="border-line flex items-center justify-between space-x-4 py-4"
									key={account.id}
								>
									<Link to={`/${account.slug}}`}>
										{account.name}
									</Link>
									<div className="flex items-center">
										<Link
											to={`/admin/accounts/edit/${account.id}/`}
											className="button button-ghost"
										>
											<HiOutlinePencil />
										</Link>
										<Form method="post">
											<input
												type="hidden"
												name="action"
												value="delete"
											/>
											<input
												type="hidden"
												name="id"
												value={account.id}
											/>

											<Button ghost type="submit">
												<HiOutlineTrash />
											</Button>
										</Form>
									</div>
								</div>
							))
						) : (
							<div>Nenhum cliente cadastrado</div>
						)}
					</div>
				</div>
				<AnimatePresence>
					<Outlet />
				</AnimatePresence>
			</div>
		</>
	);
}
