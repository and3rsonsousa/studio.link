import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { Button, InputField } from "~/components/Forms";
import Panel from "~/components/Layout/Panel";
import { addAccount, deleteAccount } from "~/utils/data.server";
import type { PersonModel } from "~/utils/models";
import { supabaseClient } from "~/utils/supabase.server";
import { scaleUp } from "~/utils/transitions";

export const loader: LoaderFunction = async () => {
	const { data: persons, error } = await supabaseClient
		.from("Person")
		.select();

	if (error) {
		return { error };
	}

	return { persons };
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();

	let users = formData.getAll("users") as string[];
	return addAccount(
		formData.get("name") as string,
		formData.get("slug") as string,
		users
	);
};

export default function () {
	const { persons }: { persons: PersonModel[] } = useLoaderData();
	const actionData = useActionData();

	return (
		<motion.div {...scaleUp} className="w-full">
			<h3 className="text-gray-300">Novo Cliente</h3>
			<Panel duration={0.5} delay={0}>
				{actionData && actionData.error && (
					<div className="error-banner">
						{actionData.error.message}
					</div>
				)}
			</Panel>
			<Form method="post">
				<input type="hidden" name="action" value="new" />
				<InputField
					label="Nome"
					name="name"
					type="text"
					placeholder="Nome do Cliente"
					required
				/>
				<InputField
					label="Slug"
					name="slug"
					type="text"
					placeholder="Slug do Cliente"
					required
				/>
				{persons.map((person) => (
					<InputField
						key={person.id}
						label={person.name}
						name="users"
						type="checkbox"
						value={person.user}
						placeholder="Slug do Cliente"
					/>
				))}
				<div className="mt-4 flex justify-end">
					<Button primary>Cadastrar</Button>
				</div>
			</Form>
		</motion.div>
	);
}
