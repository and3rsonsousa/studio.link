import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { Button, Field } from "~/components/Forms";
import Panel from "~/components/Layout/Panel";
import { updateAccount } from "~/utils/data";
import type { AccountModel, PersonModel } from "~/utils/models";
import { supabaseClient } from "~/utils/supabase";
import { scaleUp } from "~/utils/transitions";

export const loader: LoaderFunction = async ({ params }) => {
	// const [{ data: account }, { data: persons }] = await Promise.all([
	// 	await supabaseClient
	// 		.from("Account")
	// 		.select()
	// 		.order("name", {
	// 			ascending: true,
	// 		})
	// 		.eq("id", params.id)
	// 		.single(),
	// 	supabaseClient.from("Person").select(),
	// ]);

	return {};
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();

	let users = formData.getAll("users") as string[];

	return updateAccount(
		formData.get("id") as string,
		formData.get("name") as string,
		formData.get("slug") as string,
		users
	);
};

export default function AdminAccountsEdit() {
	const {
		account,
		persons,
	}: { account: AccountModel; persons: PersonModel[] } = useLoaderData();
	const actionData = useActionData();
	return (
		<motion.div {...scaleUp} className="w-full">
			<h3 className="text-gray-300">Editar Cliente</h3>
			<Panel duration={0.5} delay={0}>
				{actionData && actionData.error && (
					<div className="error-banner">
						{actionData.error.message}
					</div>
				)}
			</Panel>
			<Form method="post">
				<input type="hidden" name="id" value={account.id} />
				<Field
					name="name"
					label="Nome"
					type="text"
					value={account.name}
					required
				/>
				<Field
					name="slug"
					label="Slug"
					type="text"
					value={account.slug}
					required
				/>
				<div className="flex gap-4">
					{persons.map((person) => (
						<Field
							key={person.id}
							type="checkbox"
							label={person.name}
							name="users"
							value={person.user}
							checked={
								account.users.filter(
									(user) => user === person.user
								).length > 0
							}
						/>
					))}
				</div>
				<div className="mt-4 flex justify-end">
					<Button primary type="submit">
						Atualizar
					</Button>
				</div>
			</Form>
		</motion.div>
	);
}
