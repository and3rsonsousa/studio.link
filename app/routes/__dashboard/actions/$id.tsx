import type { LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useMatches } from "@remix-run/react";
import { SelectField } from "~/components/Forms";
import Field from "~/components/Forms/InputField";
import TextareaField from "~/components/Forms/TextareaField";
import { getAction } from "~/utils/data.server";
import type { ItemModel } from "~/utils/models";

export const loader: LoaderFunction = async ({ request, params }) => {
	const { id } = params;
	const action = await getAction(id);

	return { action };
};

export default function ActionEdit() {
	const matches = useMatches();
	const { tags, status: statuses, accounts, campaigns } = matches[1].data;
	const { action } = useLoaderData();

	return (
		<div>
			<div>
				<h3 className="text-gray-300">Editar Ação</h3>
				<Form method="post">
					<Field
						name="name"
						type="text"
						label="Nome"
						value={action.name}
					/>
					<div className="gap-4 md:flex">
						<SelectField
							name="account"
							label="Cliente"
							options={accounts.map((account: ItemModel) => ({
								id: account.id,
								text: account.name,
								value: account.id,
							}))}
							value={action.account.id}
						/>
						<SelectField
							name="campaign"
							label="Campanha"
							options={statuses.map((status: ItemModel) => ({
								id: status.id,
								text: status.name,
								value: status.id,
							}))}
						/>
					</div>
					<TextareaField name="description" label="Descrição" />
					<div className="gap-4 md:flex">
						<SelectField
							name="tag"
							label="Tag"
							options={tags.map((tag: ItemModel) => ({
								id: tag.id,
								text: tag.name,
								value: tag.id,
							}))}
						/>
						<SelectField
							name="status"
							label="Status"
							options={statuses.map((status: ItemModel) => ({
								id: status.id,
								text: status.name,
								value: status.id,
							}))}
						/>
						<SelectField
							name="responsible"
							label="Responsável"
							options={statuses.map((status: ItemModel) => ({
								id: status.id,
								text: status.name,
								value: status.id,
							}))}
						/>
					</div>
				</Form>
			</div>
			<pre>{JSON.stringify(action, null, 2)}</pre>
		</div>
	);
}
