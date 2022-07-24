import { Combobox } from "@headlessui/react";
import { useMatches, useNavigate } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import type { AccountModel, ActionModel, CampaignModel } from "~/utils/models";
import { supabaseClient } from "~/utils/supabase";
import { scaleUp } from "~/utils/transitions";
import Loader from "./Loader";

export default function SearchBox() {
	const [query, setQuery] = useState("");
	const [items, setItems] = useState<{
		actions: any;
		accounts: any;
		campaigns: any;
	}>();
	const [searching, setSearching] = useState(false);
	const matches = useMatches();
	const _accounts = matches[1].data.accounts;

	const search = async (str: string) => {
		if (str.length > 2) {
			setSearching(() => true);

			const [{ data: actions }, { data: campaigns }, { data: accounts }] =
				await Promise.all([
					supabaseClient.rpc("search_for_actions", {
						query: `%${str
							.normalize("NFD")
							.replace(/[\u0300-\u036f]/g, "")}%`,
					}),
					supabaseClient.rpc("search_for_campaigns", {
						query: `%${str
							.normalize("NFD")
							.replace(/[\u0300-\u036f]/g, "")}%`,
					}),
					supabaseClient.rpc("search_for_accounts", {
						query: `%${str
							.normalize("NFD")
							.replace(/[\u0300-\u036f]/g, "")}%`,
					}),
				]);

			setItems({ actions, accounts, campaigns });
			setSearching(() => false);
		}
	};

	useEffect(() => {
		const keyDown = (e: KeyboardEvent) => {
			if (e.metaKey && e.key === "/") {
				const ele: HTMLElement = document.querySelector(
					".search-box"
				) as HTMLElement;
				ele.focus();
			}
		};
		window.addEventListener("keydown", keyDown);
		return () => window.removeEventListener("keydown", keyDown);
	}, []);

	const navigate = useNavigate();

	return (
		<Combobox
			as={"div"}
			onChange={(value: ActionModel | AccountModel | CampaignModel) => {
				setQuery("");

				navigate(
					// Caso seja um cliente
					"slug" in value
						? `/${value.slug}/page`
						: // Caso seja campanha
						"actions" in value
						? `/${
								_accounts.filter(
									(account: AccountModel) =>
										account.id === value.account
								)[0].slug
						  }/page/campaigns/${value.id}`
						: // Caso seja uma ação
						  `/${
								_accounts.filter(
									(account: AccountModel) =>
										account.id === value.account
								)[0].slug
						  }/action/${value.id}`
				);
			}}
			value={undefined}
			className={`relative`}
		>
			<div className="field-input-holder">
				<Combobox.Input
					className="field-input search-box"
					placeholder="Busque por uma ação ou campanha"
					onChange={(event) => {
						setQuery(event.target.value);
						search(event.target.value);
					}}
					onBlur={() => {
						setQuery("");
					}}
				/>
				<div className="field-icon field-button ">
					<HiOutlineSearch />
				</div>
			</div>
			<AnimatePresence>
				{query.length > 2 && (
					<Combobox.Options
						static
						className={`dropdown-content absolute top-12 max-h-[50vh] w-full origin-top overflow-y-auto`}
						{...scaleUp()}
						as={motion.div}
					>
						{items ? (
							<>
								{items.actions && items.actions.length > 0 ? (
									<>
										<div className="default-spacing text-xs uppercase tracking-wider text-gray-400">
											Ações
										</div>{" "}
										{items.actions.map(
											(
												action: ActionModel,
												index: number
											) => (
												<Combobox.Option
													key={index}
													value={action}
													as={Fragment}
												>
													{({ active }) => (
														<div
															className={`dropdown-item flex items-center justify-between ${
																active
																	? "bg-brand text-white"
																	: ""
															}`}
														>
															<div className="flex items-center gap-2">
																<div>
																	{
																		action.name
																	}
																</div>
															</div>
														</div>
													)}
												</Combobox.Option>
											)
										)}
									</>
								) : null}
								{/* Accounts */}
								{items.accounts && items.accounts.length > 0 ? (
									<>
										<div
											className={`default-spacing text-xs uppercase tracking-wider text-gray-400 ${
												items.actions.length > 0
													? "mt-4"
													: ""
											}`}
										>
											Clientes
										</div>{" "}
										{items.accounts.map(
											(
												account: AccountModel,
												index: number
											) => (
												<Combobox.Option
													key={index}
													value={account}
													as={Fragment}
												>
													{({ active }) => (
														<div
															className={`dropdown-item flex items-center justify-between ${
																active
																	? "bg-brand text-white"
																	: ""
															}`}
														>
															<div className="flex items-center gap-2">
																<div>
																	{
																		account.name
																	}
																</div>
															</div>
														</div>
													)}
												</Combobox.Option>
											)
										)}
									</>
								) : null}
								{/* Campaigns */}
								{items.campaigns &&
								items.campaigns.length > 0 ? (
									<>
										<div
											className={`default-spacing text-xs uppercase tracking-wider text-gray-400 ${
												items.actions.length > 0
													? "mt-4"
													: ""
											}`}
										>
											Campanhas
										</div>{" "}
										{items.campaigns.map(
											(
												campaign: CampaignModel,
												index: number
											) => (
												<Combobox.Option
													key={index}
													value={campaign}
													as={Fragment}
												>
													{({ active }) => (
														<div
															className={`dropdown-item flex items-center justify-between ${
																active
																	? "bg-brand text-white"
																	: ""
															}`}
														>
															<div className="flex items-center gap-2">
																<div className="overflow-hidden text-ellipsis whitespace-nowrap">
																	{
																		campaign.name
																	}
																</div>
															</div>
														</div>
													)}
												</Combobox.Option>
											)
										)}
									</>
								) : null}
							</>
						) : searching ? (
							<div className="flex items-center justify-center gap-2 p-4 text-gray-500 dark:text-gray-300">
								<div>Buscando</div> <Loader />
							</div>
						) : (
							<div className="p-4 text-gray-500 dark:text-gray-300">
								Sem resultados {":("}
							</div>
						)}
					</Combobox.Options>
				)}
			</AnimatePresence>
		</Combobox>
	);
}
