import { Combobox } from "@headlessui/react";
import { Link, useLoaderData, useMatches, useNavigate } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import {
	HiOutlineClipboard,
	HiOutlineClipboardList,
	HiOutlineMoon,
	HiOutlineSearch,
	HiOutlineSun,
} from "react-icons/hi";
import { BsCardChecklist, BsGrid3X3 } from "react-icons/bs";
import type {
	AccountModel,
	ActionModel,
	ActionModelFull,
	DropdownOptions,
	PersonModel,
} from "~/utils/models";
import { supabaseClient } from "~/utils/supabase";

import { scaleUp } from "~/utils/transitions";
import Dropdown from "./Dropdown";
import Loader from "./Loader";
import Logo from "./Logo";

const Layout: React.FC = ({ children }) => {
	useEffect(() => {
		let theme;
		if (localStorage) {
			theme = localStorage.getItem("theme");
		}
		if (theme) {
			document.body.classList.add(theme);
		}

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "?" || e.key === "/") {
				document.getElementById("search")?.focus();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});

	return (
		<div className="flex h-screen flex-col bg-white dark:bg-gray-900">
			<div className="header flex-auto text-sm font-semibold">
				<div className="mx-auto flex flex-wrap items-center justify-between gap-4 py-4 px-8 xl:container">
					{/* Left Side */}
					<Link to={`/`} className="order-1">
						<Logo size={3} />
					</Link>
					{/* Center */}
					<div className="order-5 my-4 w-full md:order-2 md:w-auto">
						<AccountsMenu />
					</div>
					<div className="order-3 w-1/2 md:w-auto">
						<SearchBox />
					</div>

					{/* Right side */}
					<div className="order-4 flex space-x-2">
						<UserMenu />
					</div>
				</div>
			</div>

			<div className="app-content mx-auto h-full flex-auto overflow-y-auto px-8 xl:container">
				{children}
			</div>

			<div className="flex-auto">
				<div className="text-xx py-2 text-center font-bold tracking-widest text-gray-300 dark:text-gray-700">
					{new Date().getFullYear()} © CNVT
				</div>
			</div>
		</div>
	);
};

const SearchBox: React.FC = () => {
	const [query, setQuery] = useState("");
	const [items, setItems] = useState<any>();
	const [searching, setSearching] = useState(false);
	const matches = useMatches();
	const { accounts } = matches[1].data;

	const search = async (str: string) => {
		if (str.length > 2) {
			setSearching(() => true);

			const { data } = await supabaseClient.rpc("do_search", {
				query: `%${str
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")}%`,
			});

			if (data) setItems(data);
			setSearching(() => false);
		} else {
			setItems([]);
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
			onChange={(value: ActionModel) => {
				setQuery("");
				navigate(
					`/${
						accounts.filter(
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
						{items && items.length > 0 ? (
							items.map(
								(action: ActionModelFull, index: number) => (
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
													<div>{action.name}</div>
												</div>
											</div>
										)}
									</Combobox.Option>
								)
							)
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
};

const AccountsMenu: React.FC = () => {
	let { accounts }: { accounts: AccountModel[] } = useLoaderData();
	let matches = useMatches();
	const account = matches[1].params.account
		? accounts.filter(
				(account) => account.slug === matches[1].params.account
		  )[0].name
		: undefined;

	return (
		<div className="flex items-center justify-between gap-4">
			<Dropdown
				options={accounts.map(({ id, name, slug }) => ({
					id,
					text: name,
					href: `/${slug}`,
				}))}
				text={account ?? "Escolha um cliente"}
				className={
					account
						? {
								trigger:
									"m-0 text-2xl font-bold tracking-tight",
						  }
						: undefined
				}
			/>

			{account && (
				<div className="flex items-center gap-4">
					<Link
						to={`/${matches[1].params.account}/page/grid`}
						className="button-ghost text-xl"
					>
						<BsGrid3X3 />
					</Link>
					<Link
						to={`/${matches[1].params.account}/page/campaigns`}
						className="button-ghost text-2xl"
					>
						<BsCardChecklist />
					</Link>
				</div>
			)}
		</div>
	);
};

const UserMenu: React.FC = () => {
	let { person }: { person: PersonModel } = useLoaderData();
	let options: DropdownOptions = [
		() => <ThemeSwitcher key={"theme-switcher"} />,
		"divider",
		{ id: "account", href: "/account", text: "Minha conta" },
		{ id: "logout", href: "/signout", text: "Sair" },
	];

	if (person.admin) {
		options = options.concat([
			"divider",
			{ id: "users", href: "/admin/users", text: "Usuários" },
			{ id: "newuser", href: "/admin/users/new", text: "Novo usuário" },
			{ id: "accounts", href: "/admin/accounts", text: "Clientes" },
			{
				id: "newaccount",
				href: "/admin/accounts/new",
				text: "Novo Cliente",
			},
		]);
	}

	return (
		<Dropdown
			text={() => <span className="hidden md:block">{person.name}</span>}
			options={options}
		/>
	);
};

const ThemeSwitcher = () => {
	let [theme, setTheme] = useState(localStorage.getItem("theme"));

	// if (localStorage.getItem("theme")) {
	// 	setTheme("dark");
	// }

	return (
		<div className=" default-spacing flex items-center justify-center gap-4">
			<button
				className={`button py-0 ${
					theme ? "button-ghost" : "button-primary"
				}`}
				onClick={() => {
					document.body.classList.remove("dark");
					localStorage.removeItem("theme");
					setTheme("");
				}}
			>
				<HiOutlineSun className={`h-11  text-2xl`} />
			</button>
			<button
				className={`button ${
					theme ? "button-primary" : "button-ghost"
				}`}
				onClick={() => {
					document.body.classList.add("dark");
					localStorage.setItem("theme", "dark");
					setTheme("dark");
				}}
			>
				<HiOutlineMoon className={`text-xl `} />
			</button>
		</div>
	);
};

export default Layout;
