import type { LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useMatches } from "@remix-run/react";
import { SelectField } from "~/components/Forms";
import Field from "~/components/Forms/InputField";
import TextareaField from "~/components/Forms/TextareaField";
import { getAccount, getAction } from "~/utils/data.server";
import type { ItemModel } from "~/utils/models";

export const loader: LoaderFunction = async ({ request, params }) => {
	const { account, id } = params;

	const [{ data: action }, { data: _account }] = await Promise.all([
		getAction(id),
		getAccount(account as string),
	]);

	console.log({ action, _account });

	return { action, _account };
};

export default function ActionEdit() {
	const matches = useMatches();
	const {
		tags,
		status: statuses,
		accounts,
		campaigns,
		persons,
	} = matches[1].data;
	const { action, _account: account } = useLoaderData();

	return (
		<div className="flex gap-8">
			<div className="w-2/3">
				<div>
					<div>
						<h3 className="text-gray-700 dark:text-gray-300">
							Editar Ação
						</h3>
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
									options={accounts.map(
										(account: ItemModel) => ({
											id: account.id,
											text: account.name,
											value: account.id,
										})
									)}
									value={action.account.id}
								/>
								{/* <SelectField
							name="campaign"
							label="Campanha"
							options={[]}
						/> */}
							</div>
							<TextareaField
								name="description"
								label="Descrição"
								value={action.description}
							/>
							<div className="gap-4 md:flex">
								<SelectField
									name="tag"
									label="Tag"
									options={tags.map((tag: ItemModel) => ({
										id: tag.id,
										text: tag.name,
										value: tag.id,
									}))}
									value={action.tag.id}
								/>
								<SelectField
									name="status"
									label="Status"
									options={statuses.map(
										(status: ItemModel) => ({
											id: status.id,
											text: status.name,
											value: status.id,
										})
									)}
									value={action.status.id}
								/>
								<SelectField
									name="responsible"
									label="Responsável"
									options={persons.map(
										(status: ItemModel) => ({
											id: status.id,
											text: status.name,
											value: status.id,
										})
									)}
									value={action.responsible.id}
								/>
							</div>
						</Form>
					</div>
					<pre>{JSON.stringify(action, null, 2)}</pre>
				</div>
			</div>
			<div
				className="w-1/3 space-y-8
      "
			>
				<div>
					<h3 className="text-gray-700 dark:text-gray-300">
						{account.name}
					</h3>
				</div>
				<div>
					<h4 className="text-gray-700 dark:text-gray-300">
						Recentes
					</h4>
					Ações recentes desse cliente
				</div>
				<div>
					<h4 className="text-gray-700 dark:text-gray-300">
						Campanhas
					</h4>
					Campanhas desse cliente
				</div>
			</div>
		</div>
	);
}
