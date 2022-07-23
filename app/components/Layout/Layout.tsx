import {
	Link,
	useLoaderData,
	useMatches,
	useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { BsCardChecklist } from "react-icons/bs";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { MdGridOn } from "react-icons/md";
import type {
	AccountModel,
	DropdownOptions,
	PersonModel,
} from "~/utils/models";

import Dropdown from "./Dropdown";
import Logo from "./Logo";
import SearchBox from "./SearchBox";

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
			<div className="header flex-auto border-b text-sm font-semibold dark:border-gray-800">
				<div className="mx-auto flex flex-wrap items-center justify-between gap-4 py-4 px-8 xl:container">
					{/* Left Side */}
					<Link to={`/`} className="order-1">
						<Logo size={3} holding={1} />
					</Link>
					{/* Center */}
					<div className="order-5 my-4 w-full lg:order-2 lg:m-0 lg:w-auto">
						<AccountsMenu />
					</div>
					<div className="order-3 w-1/2 lg:w-2/5 2xl:w-1/4">
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

const AccountsMenu: React.FC = () => {
	let { accounts }: { accounts: AccountModel[] } = useLoaderData();
	let matches = useMatches();
	const account = matches[1].params.account
		? accounts.filter(
				(account) => account.slug === matches[1].params.account
		  )[0].name
		: undefined;

	const [searchParams] = useSearchParams();
	const date = searchParams.get("date");

	return (
		<div className="flex items-center justify-between gap-4">
			<Dropdown
				options={accounts.map(({ id, name, slug }) => ({
					id,
					text: name,
					href: `/${slug}/page/${date ? `?date=${date}` : ""}`,
				}))}
				text={account ?? "Escolha um cliente"}
				className={
					account
						? {
								trigger:
									"m-0 -my-2 text-2xl font-bold tracking-tight",
						  }
						: undefined
				}
			/>

			{account && (
				<div className="flex items-center gap-4">
					<Link
						to={`/${matches[1].params.account}/page/grid`}
						className="button-ghost text-2xl"
					>
						<MdGridOn />
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
			text={<span className="hidden lg:block">{person.name}</span>}
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
