import type {
	ActionFunction,
	LoaderFunction,
	MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
	Form,
	Link,
	useLoaderData,
	useMatches,
	useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Button, InputField, SelectField } from "~/components/Forms";
import CheckboxField from "~/components/Forms/Checkbox";
import Field from "~/components/Forms/InputField";
import TextareaField from "~/components/Forms/TextareaField";
import {
	getAccount,
	getAction,
	getCampaigns,
	getPersons,
	updateAction,
} from "~/utils/data.server";
import type { ItemModel } from "~/utils/models";

export const meta: MetaFunction = ({ data }) => {
	const { action } = data;

	return {
		title: `EDITAR > ${action.name} - ${action.account.name} > STUDIO`,
		description: "",
	};
};

export const loader: LoaderFunction = async ({ request, params }) => {
	const { account, id } = params;

	const [
		{ data: action },
		{ data: _account },
		{ data: campaigns },
		{ data: persons },
	] = await Promise.all([
		getAction(id),
		getAccount({ slug: account as string }),
		getCampaigns(account as string),
		getPersons(),
	]);

	if (action) return { action, _account, campaigns, persons };

	throw new Error("Action not found");
};

export default function ActionEdit() {
	const matches = useMatches();

	// console.log(matches);

	const { accounts, tags, status: statuses } = matches[1].data;

	const { action, _account: account, campaigns, persons } = useLoaderData();
	const [endDate, setEndDate] = useState(action.date_end ? true : false);
	const [searchParams] = useSearchParams();

	return (
		<div className="flex gap-8 py-2">
			<div className="w-2/3">
				<div>
					<div>
						<h3 className="text-gray-700 dark:text-gray-300">
							Editar Ação
						</h3>
						<Form method="post">
							<input
								type="hidden"
								name="action"
								value="update-action"
							/>
							<input type="hidden" name="id" value={action.id} />
							<input
								type="hidden"
								name="redirectTo"
								value={searchParams.get("redirectTo") as ""}
							/>
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
							<div
								className={`md:flex ${
									!endDate ? "items-center" : ""
								} gap-4`}
							>
								<InputField
									name="date"
									label="Data"
									type="datetime-local"
									value={action.date}
								/>
								<div className="w-full">
									{endDate && (
										<InputField
											name="date_end"
											label="Data Final"
											type="datetime-local"
											value={action.date_end}
										/>
									)}
									<div className={!endDate ? "md:mt-12" : ""}>
										<CheckboxField
											label="Exibir Data Final"
											onChange={() =>
												setEndDate(!endDate)
											}
											checked={endDate}
										/>
									</div>
								</div>
							</div>
							<div className="mt-8 flex justify-end">
								<Button type="submit" primary>
									Atualizar
								</Button>
							</div>
						</Form>
					</div>
					{/* <pre>{JSON.stringify(action, null, 2)}</pre> */}
				</div>
			</div>
			<div className="w-1/3 space-y-8">
				<div className="flex items-center justify-between">
					<h3 className="text-gray-700 dark:text-gray-300">
						{account.name}
					</h3>
					<Link to={`/${account.slug}`}>
						<HiOutlineExternalLink />
					</Link>
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

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();

	const redirectTo = formData.get("redirectTo") as string;

	const id = formData.get("id") as string;
	const name = formData.get("name") as string;
	const account = formData.get("account[id]") as string;
	const description = formData.get("description") as string;
	const tag = formData.get("tag[id]") as string;
	const status = formData.get("status[id]") as string;
	const responsible = formData.get("responsible[id]") as string;
	const date = formData.get("date") as string;
	const date_end = formData.get("date_end") as string;

	const { error } = await updateAction(id, {
		name,
		date,
		date_end,
		account,
		description,
		tag,
		status,
		responsible,
	});

	if (error) return error;

	return redirect(redirectTo ? redirectTo : `/`);
};
