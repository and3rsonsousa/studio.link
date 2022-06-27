import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HiOutlineChevronDown, HiOutlineChevronRight } from "react-icons/hi";
import type { AccountModel, PersonModel } from "~/utils/models";
import { Avatar } from "./Avatar";
import Logo from "./Logo";

const dropdownAnimations = {
	initial: { opacity: 0, scale: 0.9 },
	animate: {
		opacity: 1,
		scale: 1,
		transition: { ease: "circOut", duration: 0.2 },
	},
	exit: {
		opacity: 0,
		scale: 0.9,
		transition: { ease: "circOut", duration: 0.2 },
	},
};

const Layout: React.FC = ({ children }) => {
	let {
		person,
		accounts,
	}: { person: PersonModel; accounts: Array<AccountModel> } = useLoaderData();
	let [isOpen, setIsOpen] = useState<boolean>(false);
	const sideOffset = 4;

	let navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gray-900">
			<div className="header text-sm font-semibold">
				<div className="mx-auto flex items-center justify-between py-4 px-8 xl:container">
					{/* Left Side */}
					<Link to={`/`}>
						<Logo />
					</Link>
					{/* Center */}
					<div>
						{accounts && accounts.length > 0 ? (
							<div className="flex items-center space-x-2">
								{accounts.map((account) => (
									<Avatar
										name={account.name}
										key={account.id}
										size="md"
									/>
								))}
							</div>
						) : (
							<div>Nenhum cliente</div>
						)}
					</div>
					{/* Right side */}
					<div className="flex space-x-2">
						<DropdownMenu.Root
							open={isOpen}
							onOpenChange={setIsOpen}
						>
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
										<motion.div {...dropdownAnimations}>
											<DropdownMenu.Group>
												<DropdownMenu.Item className="dropdown-item">
													Minha Conta
												</DropdownMenu.Item>
												<DropdownMenu.Item
													className="dropdown-item"
													onSelect={() =>
														navigate(`/signout`)
													}
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
																sideOffset={
																	sideOffset
																}
															>
																<DropdownMenu.Item className="dropdown-item">
																	Ver todos os
																	Usuários
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
																sideOffset={
																	sideOffset
																}
															>
																<DropdownMenu.Item
																	className="dropdown-item"
																	onSelect={() =>
																		navigate(
																			"/admin/accounts"
																		)
																	}
																>
																	Ver todos os
																	Clientes
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
					</div>
				</div>
			</div>

			<div className="mx-auto px-8 xl:container">{children}</div>
		</div>
	);
};

export default Layout;
