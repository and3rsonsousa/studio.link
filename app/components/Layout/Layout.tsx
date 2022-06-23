import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { HiOutlineChevronRight } from "react-icons/hi";
import type { PersonModel } from "~/utils/models";
import Logo from "./Logo";

const Layout: React.FC = ({ children }) => {
	let { person }: { person: PersonModel } = useLoaderData();
	const sideOffset = 4;

	let navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gray-900">
			<div className="header text-sm font-semibold">
				<div className="mx-auto flex items-center justify-between py-4 px-8 xl:container">
					<Logo />
					<div> Contas </div>
					<div className="flex space-x-2">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger className="dropdown-trigger">
								{person.name}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content
								loop
								align="end"
								sideOffset={sideOffset * 4}
								className="dropdown-content"
							>
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
										<DropdownMenu.Separator className="border-t border-gray-900" />
										<DropdownMenu.Group>
											<DropdownMenu.Label className="default-spacing text-xs font-semibold uppercase tracking-wide">
												Admin
											</DropdownMenu.Label>
											<DropdownMenu.Root>
												<DropdownMenu.TriggerItem className="dropdown-item flex items-center justify-between">
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
																"/accounts"
															)
														}
													>
														Ver todos os Clientes
													</DropdownMenu.Item>
													<DropdownMenu.Item className="dropdown-item">
														Novo Cliente
													</DropdownMenu.Item>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</DropdownMenu.Group>
									</>
								)}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>
			</div>
			{children}
		</div>
	);
};

export default Layout;
