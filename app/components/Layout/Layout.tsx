import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
	HiOutlineChevronDown,
	HiOutlineChevronRight,
	HiOutlineSearch,
} from "react-icons/hi";
import type { AccountModel, PersonModel } from "~/utils/models";
import { scaleUp } from "~/utils/transitions";
import { Field } from "../Forms";
import Logo from "./Logo";

const Layout: React.FC = ({ children }) => {
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
					<div>
						<Field
							after={
								<button
									type="button"
									className="field-icon field-button transition"
								>
									<HiOutlineSearch />
								</button>
							}
							autoFocus
							type="text"
							name="search"
							placeholder="Buscar"
						/>
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
				<div className="border-t border-gray-800 py-2 text-center text-xs font-bold tracking-widest text-gray-700">
					{new Date().getFullYear()} © CNVT
				</div>
			</div>
		</div>
	);
};

const AccountsMenu: React.FC = () => {
	let { accounts }: { accounts: AccountModel[] } = useLoaderData();
	let [isOpen, setIsOpen] = useState<boolean>(false);
	const sideOffset = 4;

	let navigate = useNavigate();
	return (
		<DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenu.Trigger className="dropdown-trigger flex items-center">
				Selecione um cliente
				{/* {account.name} */}
				<div className="pl-2">
					<HiOutlineChevronDown />
				</div>
			</DropdownMenu.Trigger>
			<AnimatePresence>
				{isOpen && (
					<DropdownMenu.Content
						loop
						sideOffset={sideOffset * 4}
						asChild
						forceMount
						className="dropdown-content origin-top"
					>
						<motion.div {...scaleUp()}>
							{accounts.map((account) => (
								<DropdownMenu.Item
									key={account.id}
									className="dropdown-item"
									onSelect={() =>
										navigate(`/${account.slug}`)
									}
								>
									{account.name}
								</DropdownMenu.Item>
							))}
						</motion.div>
					</DropdownMenu.Content>
				)}
			</AnimatePresence>
		</DropdownMenu.Root>
	);
};
const UserMenu: React.FC = () => {
	let { person }: { person: PersonModel } = useLoaderData();
	let [isOpen, setIsOpen] = useState<boolean>(false);
	const sideOffset = 4;

	let navigate = useNavigate();
	return (
		<DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenu.Trigger className="dropdown-trigger flex items-center">
				{person.name}
				<div className="pl-2">
					<HiOutlineChevronDown />
				</div>
			</DropdownMenu.Trigger>
			<AnimatePresence>
				{isOpen && (
					<DropdownMenu.Content
						loop
						align="end"
						sideOffset={sideOffset * 4}
						asChild
						forceMount
						className="dropdown-content origin-top"
					>
						<motion.div {...scaleUp()}>
							<DropdownMenu.Group>
								<DropdownMenu.Item className="dropdown-item">
									Minha Conta
								</DropdownMenu.Item>
								<DropdownMenu.Item
									className="dropdown-item"
									onSelect={() => navigate(`/signout`)}
								>
									Sair
								</DropdownMenu.Item>
							</DropdownMenu.Group>

							{person.admin && (
								<>
									<DropdownMenu.Separator className="dropdown-divider" />
									<DropdownMenu.Group>
										<DropdownMenu.Label className="default-spacing text-xs font-semibold uppercase tracking-wide">
											Admin
										</DropdownMenu.Label>
										<DropdownMenu.Root>
											<DropdownMenu.TriggerItem
												className="dropdown-item flex items-center justify-between"
												disabled
											>
												Usuários
												<div className="pl-8">
													<HiOutlineChevronRight />
												</div>
											</DropdownMenu.TriggerItem>
											<DropdownMenu.Content
												loop
												className="dropdown-content"
												sideOffset={sideOffset}
											>
												<DropdownMenu.Item className="dropdown-item">
													Ver todos os Usuários
												</DropdownMenu.Item>
												<DropdownMenu.Item className="dropdown-item">
													Novo Usuário
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
										<DropdownMenu.Root>
											<DropdownMenu.TriggerItem className="dropdown-item flex items-center justify-between">
												Clientes
												<div className="pl-8">
													<HiOutlineChevronRight />
												</div>
											</DropdownMenu.TriggerItem>
											<DropdownMenu.Content
												loop
												className="dropdown-content"
												sideOffset={sideOffset}
											>
												<DropdownMenu.Item
													className="dropdown-item"
													onSelect={() =>
														navigate(
															"/admin/accounts"
														)
													}
												>
													Ver todos os Clientes
												</DropdownMenu.Item>
												<DropdownMenu.Item
													className="dropdown-item"
													onSelect={() =>
														navigate(
															"/admin/accounts/new"
														)
													}
												>
													Novo Cliente
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</DropdownMenu.Group>
								</>
							)}
						</motion.div>
					</DropdownMenu.Content>
				)}
			</AnimatePresence>
		</DropdownMenu.Root>
	);
};

export default Layout;
