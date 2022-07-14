import { useActionData, useFetcher, useMatches } from "@remix-run/react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import type { AccountModel, ItemModel } from "~/utils/models";
import { Button, InputField, SelectField } from "../Forms";
import CheckboxField from "../Forms/Checkbox";
import ComboboxField from "../Forms/ComboboxField";
import TextareaField from "../Forms/TextareaField";
import Loader from "./Loader";
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

	const fetcher = useFetcher();

	const _account = matches[3] ? matches[3].data.account : null;

	const [full, setFull] = useState(false);
	const [endDate, setEndDate] = useState(false);
	const [account, setAccount] = useState<string>(_account ? _account.id : "");
	const [tag, setTag] = useState(tags[0].id);
	const [status, setStatus] = useState(statuses[1].id);

	const isAdding = fetcher.submission
		? fetcher.submission.formData.get("action") === "create-action"
		: undefined;

	const state = fetcher.state;
	const data = fetcher.data;

	useEffect(() => {
		const keyDown = (e: KeyboardEvent) => {
			if (e.key === "k" && e.metaKey) {
				setFull(!full);
			}
		};

		window.addEventListener("keydown", keyDown);

		if (!isAdding && state === "idle" && data && !data.error) {
			if (close) close();
		}
		setTimeout(() => {
			document.getElementsByName("name")[0]?.focus();
		}, 100);

		return () => {
			window.removeEventListener("keydown", keyDown);
		};
	}, [isAdding, close, state, data, full]);

	const currentDate = dayjs().isAfter(dayjs(date).subtract(1, "hour"))
		? dayjs(
				dayjs(date).format("YYYY-MM-DD") +
					" " +
					dayjs()
						.add(dayjs().hour() < 23 ? 1 : 0, "hour")
						.format("HH:mm")
		  ).format("YYYY-MM-DD HH:mm")
		: date;

	return (
		<div className="relative">
			<div
				className={`relative${
					isAdding ? "  opacity-50 blur transition" : ""
				}`}
			>
				<div className="px-8 pt-4">
					<div className="flex items-start justify-between">
						<div>
							<h5 className="text-sm text-gray-700 dark:text-gray-300">
								Adicionar nova ação
							</h5>
							<div className="text-xs text-gray-400 dark:text-gray-300/50">
								{dayjs(currentDate).format(
									"D [de] MMMM [de] YYYY [às] HH[h]mm"
								)}
							</div>
							{data && data.error && (
								<div className="error-banner mt-2">
									{data.error.message}
								</div>
							)}
						</div>
						<button
							className="button button-ghost -m-2 p-2 text-xl text-gray-400 transition hover:text-gray-700 dark:text-gray-300/50 dark:hover:text-white"
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
					<fetcher.Form method="post" id="add_action">
						<input
							name="action"
							type="hidden"
							value="create-action"
						/>
						<input name="creator" type="hidden" value={personId} />
						<input
							name="responsible"
							type="hidden"
							value={personId}
						/>
						<input name="account" type="hidden" value={account} />
						<input name="tag" type="hidden" value={tag} />
						<input name="status" type="hidden" value={status} />

						{!full && (
							<>
								<input
									name="date"
									type="hidden"
									value={currentDate}
								/>
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
							value={account}
						/>

						<Panel
							panelClassName="-mx-2"
							contentClassName="px-2"
							id="add-acion"
						>
							{full && (
								<>
									<TextareaField
										name="description"
										label="Descrição"
										rows={3}
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
												callBack={(value) =>
													setTag(value)
												}
											/>
										</div>
										<div className="w-full">
											<SelectField
												options={statuses.map(
													(status) => ({
														id: status.id,
														text: status.name,
														value: status.id,
													})
												)}
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
										value={currentDate}
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
												value={dayjs(currentDate)
													.add(3, "day")
													.format("YYYY-MM-DD HH:mm")}
											/>
										</div>
									)}
								</>
							)}
						</Panel>
					</fetcher.Form>
					<div className="mt-2 flex justify-end gap-2">
						<Button type="submit" primary form="add_action">
							Adicionar
						</Button>
					</div>
				</div>
			</div>
			{isAdding && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="absolute inset-0 grid place-items-center p-4"
				>
					<Loader />
				</motion.div>
			)}
		</div>
	);
}
