import { Combobox } from "@headlessui/react";
import { Link, useLoaderData } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { HiOutlineMoon, HiOutlineSearch, HiOutlineSun } from "react-icons/hi";
import type {
	AccountModel,
	DropdownOptions,
	PersonModel,
} from "~/utils/models";
import { scaleUp } from "~/utils/transitions";
import Dropdown from "./Dropdown";
import Logo from "./Logo";

const Layout: React.FC = ({ children }) => {
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "?" || e.key === "/") {
				document.getElementById("search")?.focus();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});

	return (
		<div className="flex h-screen flex-col bg-gray-900">
			<div className="header flex-auto text-sm font-semibold">
				<div className="mx-auto flex items-center justify-between py-4 px-8 xl:container">
					{/* Left Side */}
					<Link to={`/`}>
						<Logo />
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
				<div className="text-xx py-2 text-center font-bold tracking-widest text-gray-700">
					{new Date().getFullYear()} © CNVT
				</div>
			</div>
		</div>
	);
};

const SearchBox: React.FC = () => {
	const actions = [
		{
			name: "Ação 1",
		},
		{
			name: "Ação 2",
		},
		{
			name: "Ação 3",
		},
		{
			name: "Ação 1",
		},
		{
			name: "Ação 2",
		},
		{
			name: "Ação 3",
		},
		{
			name: "Ação 1",
		},
		{
			name: "Ação 2",
		},
		{
			name: "Ação 3",
		},
		{
			name: "Ação 1",
		},
		{
			name: "Ação 2",
		},
		{
			name: "Ação 3",
		},
	];
	const [query, setQuery] = useState("");
	const filtered = query
		? actions.filter((action) =>
				action.name.toLowerCase().includes(query.toLowerCase())
		  )
		: [];

	return (
		<Combobox
			as={"div"}
			onChange={() => {}}
			value=""
			className={`relative`}
		>
			<div className="field-input-holder">
				<Combobox.Input
					className="field-input"
					placeholder="Busque por uma ação ou campanha"
					onChange={(event) => {
						setQuery(event.target.value);
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
				{query.length > 0 && (
					<Combobox.Options
						static
						className={`dropdown-content absolute max-h-[50vh] w-full origin-top overflow-y-auto`}
						{...scaleUp()}
						as={motion.div}
					>
						{filtered.length > 0 ? (
							filtered.map((action, index) => (
								<Combobox.Option
									key={index}
									value={action.name}
									as={Fragment}
								>
									{({ active }) => (
										<div
											className={`dropdown-item ${
												active
													? "bg-brand text-white"
													: ""
											}`}
										>
											{action.name}
										</div>
									)}
								</Combobox.Option>
							))
						) : (
							<div className="p-4 text-gray-300">
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
		// "divider",
		{ id: "account", href: "/account", text: "Minha conta" },
		{ id: "logout", href: "/signout", text: "Sair" },
	];

	if (person.admin) {
		options = options.concat([
			// "divider",
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
	// let [isDark, setIsDark] = useState(false);
	let isDark = false;
	if (window) {
		const html = document.getElementsByTagName("html")[0];
		// setIsDark(html.classList.contains("dark"));
		isDark = html.classList.contains("dark");
	}
	// useEffect(() => {
	// 	const html = document.getElementsByTagName("html")[0];
	// 	setIsDark(html.classList.contains("dark"));
	// }, []);
	return (
		<div className=" default-spacing flex items-center justify-center gap-4">
			<button
				className={`button py-0 ${
					isDark ? "button-ghost" : "button-primary"
				}`}
				onClick={() => {
					isDark = false;
					document
						.getElementsByTagName("html")[0]
						.classList.remove("dark");
				}}
			>
				<HiOutlineSun className={`h-11  text-2xl`} />
			</button>
			<button
				className={`button ${
					isDark ? "button-primary" : "button-ghost"
				}`}
				onClick={() => {
					// setIsDark(true);
					document
						.getElementsByTagName("html")[0]
						.classList.add("dark");
				}}
			>
				<HiOutlineMoon className={`text-xl `} />
			</button>
		</div>
	);
};

export default Layout;
