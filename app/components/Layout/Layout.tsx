import { Combobox } from "@headlessui/react";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import {
	HiOutlineMoon,
	HiOutlineSearch,
	HiOutlineSun,
	HiStar,
} from "react-icons/hi";
import type {
	AccountModel,
	ActionModel,
	ActionModelFull,
	DropdownOptions,
	ItemModel,
	PersonModel,
} from "~/utils/models";
import { supabaseClient } from "~/utils/supabase";

import { scaleUp } from "~/utils/transitions";
import Dropdown from "./Dropdown";
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
				<div className="mx-auto flex items-center justify-between py-4 px-8 xl:container">
					{/* Left Side */}
					<Link to={`/`}>
						<Logo size={3} />
					</Link>
					{/* Center */}
					<div>
						<AccountsMenu />
					</div>
					<div className="w-1/3">
						<SearchBox />
					</div>

					{/* Right side */}
					<div className="flex space-x-2">
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

	const search = async (str: string) => {
		if (str.length > 2) {
			const { data } = await supabaseClient
				.from("Action")
				.select("*, account:Account(*)")
				.ilike("name", `%${str}%`)
				.filter("account", "not.is", null);
			if (data) setItems(data);
		} else {
			setItems([]);
		}
	};

	useEffect(() => {
		const keyDown = (e: KeyboardEvent) => {
			console.log(e.key);
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
			onChange={(value: ActionModelFull) => {
				setQuery("");
				navigate(`/${value.account?.slug}/action/${value.id}`);
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
													<div className="text-xx w-6 text-center uppercase text-gray-400">
														{action.account ? (
															action.account.name.substring(
																0,
																3
															)
														) : (
															<HiStar className="mx-auto text-xs" />
														)}
													</div>
													<div>{action.name}</div>
												</div>
											</div>
										)}
									</Combobox.Option>
								)
							)
						) : (
							<div className="px-4 text-gray-500 dark:text-gray-300">
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

	return (
		<Dropdown
			options={accounts.map(({ id, name, slug }) => ({
				id,
				text: name,
				href: `/${slug}`,
			}))}
			text={"Escolha um cliente"}
		/>
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
				text: "Novo usuário",
			},
		]);
	}

	return <Dropdown text={person.name} options={options} />;
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
