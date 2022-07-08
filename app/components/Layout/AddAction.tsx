import { Form, useActionData, useMatches } from "@remix-run/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import type { AccountModel, ItemModel } from "~/utils/models";
import { Button, InputField, SelectField } from "../Forms";
import CheckboxField from "../Forms/Checkbox";
import ComboboxField from "../Forms/ComboboxField";
import Field from "../Forms/InputField";
import Panel from "./Panel";

export default function AddAction({
	date,
	close,
}: {
	date: string;
	close?: () => void;
}) {
	const matches = useMatches();
	const actionData = useActionData();
	const accounts: AccountModel[] = matches[1].data.accounts;
	const personId = matches[1].data.person.id;
	const tags: ItemModel[] = matches[1].data.tags;
	const statuses: ItemModel[] = matches[1].data.status;

	const [full, setFull] = useState(false);
	const [endDate, setEndDate] = useState(false);
	const [account, setAccount] = useState("");
	const [tag, setTag] = useState(tags[0].id);
	const [status, setStatus] = useState(statuses[0].id);

	useEffect(() => {
		setTimeout(() => {
			document.getElementsByName("name")[0]?.focus();
		}, 100);
	}, []);

	return (
		<div>
			<div className="px-8 pt-4">
				<div className="flex items-start justify-between">
					<div>
						<h5 className="text-sm text-gray-700 dark:text-gray-300">
							Adicionar nova ação
						</h5>
						<div className="text-xs text-gray-400 dark:text-gray-300/50">
							{dayjs(date).format("D [de] MMMM [de] YYYY")}
						</div>
					</div>
					<button
						className="text-xl text-gray-400 transition hover:text-gray-700 dark:text-gray-300/50 dark:hover:text-white"
						onClick={() => setFull(!full)}
					>
						<HiOutlineArrowsExpand />
					</button>
				</div>
				{actionData && actionData.error && (
					<div className="error-banner mt-4">
						{actionData.error.message}
					</div>
				)}
			</div>

			<div
				className={`${
					full ? "max-h-[400px] w-96 overflow-y-auto" : "w-96"
				} no-scroll-bars px-8 py-2`}
			>
				<Form method="post" id="add_action">
					<input name="action" type="hidden" value="create" />
					<input name="creator" type="hidden" value={personId} />
					<input name="responsible" type="hidden" value={personId} />
					<input name="account" type="hidden" value={account} />
					<input name="tag" type="hidden" value={tag} />
					<input name="status" type="hidden" value={status} />

					{!full && (
						<>
							<input name="date" type="hidden" value={date} />
						</>
					)}

					<InputField
						name="name"
						label="Nome"
						type="text"
						autoComplete="off"
						required
					/>

					<ComboboxField
						label="Cliente"
						options={accounts.map((account) => ({
							id: account.id,
							text: account.name,
							value: account.id,
						}))}
						name="account-select"
						required={full}
						opaque
						callBack={(value) => setAccount(value)}
					/>

					<Panel panelClassName="-mx-2" contentClassName="px-2">
						{full && (
							<>
								<InputField
									name="description"
									label="Descrição"
									type="text"
								/>
								<ComboboxField
									options={[]}
									name="campaign"
									label="Campanha"
									placeholder="Selecione uma campanha"
								/>
								<div className="flex gap-4">
									<div className="w-full">
										<SelectField
											options={tags.map((tag) => ({
												id: tag.id,
												text: tag.name,
												value: tag.id,
											}))}
											label="Tag"
											opaque
											value={tag}
											callBack={(value) => setTag(value)}
										/>
									</div>
									<div className="w-full">
										<SelectField
											options={statuses.map((status) => ({
												id: status.id,
												text: status.name,
												value: status.id,
											}))}
											label="Status"
											opaque
											value={status}
											callBack={(value) =>
												setStatus(value)
											}
										/>
									</div>
								</div>
								{/* <ComboboxField
									options={[]}
									name="actions"
									label="Ações relacionadas"
									placeholder="Selecione as ações relacionadas a esta"
								/> */}
								<InputField
									name="date"
									label="Data"
									type="datetime-local"
									value={date}
									required
								/>
								<CheckboxField
									checked={endDate}
									label="Inserir data final?"
									onChange={(e) => setEndDate(!endDate)}
								/>
								{endDate && (
									<div className="mb-2">
										<InputField
											name="date_end"
											label="Data Final"
											type="datetime-local"
											value={date}
										/>
									</div>
								)}
							</>
						)}
					</Panel>
				</Form>
				<div className="flex justify-end gap-2">
					<Button type="submit" primary form="add_action">
						Adicionar
					</Button>
				</div>
			</div>
		</div>
	);
}
