import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { HiOutlineLockClosed, HiOutlineLockOpen } from "react-icons/hi";
import { Button, InputField } from "~/components/Forms";
import Logo from "~/components/Layout/Logo";
import Panel from "~/components/Layout/Panel";
import { signIN, signUP } from "~/utils/auth.server";

export const meta: MetaFunction = () => ({
	title: "Login > STUDIO",
});

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	let data = Object.fromEntries(formData);
	let { action } = data;

	if (action === "signin") {
		const { email, password } = data;
		return signIN(email as string, password as string, request);
	} else if (action === "signup") {
		const { name, email, password } = data;
		return signUP(
			email as string,
			password as string,
			name as string,
			request
		);
	}

	return redirect(
		`./login${
			data.searchParams
				? `/?${new URLSearchParams([
						["action", data.searchParams as string],
				  ])}`
				: ""
		}`
	);
};

export default function LoginPage() {
	const actionData = useActionData();
	const [searchParams] = useSearchParams();
	const [action, setAction] = useState<"signin" | "signup">("signin");
	const duration = 1;

	let [showPassword, setShowPassword] = useState<true | false>(false);

	return (
		<div className="grid min-h-screen place-items-center bg-white dark:bg-gray-900">
			<div className="w-96 p-8">
				<div className="mb-8">
					<Logo />
				</div>
				<Panel duration={duration / 2} delay={0}>
					{actionData && actionData.error && (
						<div className="error-banner">
							{actionData.error.message}
						</div>
					)}
				</Panel>
				<Form method="post">
					<input
						type="hidden"
						name="searchParams"
						value={searchParams.get("action") ?? undefined}
					/>

					<Panel
						contentClassName="px-4 pb-1"
						panelClassName="-mx-4 -mb-1"
						delay={duration / 3}
					>
						{action === "signup" && (
							<InputField
								name="name"
								label="Nome"
								type="text"
								required={true}
								autoFocus={true}
								placeholder="Seu nome"
							/>
						)}
					</Panel>

					<div>
						<InputField
							name="email"
							label="E-mail"
							type="email"
							required={true}
							autoFocus={true}
							placeholder="Seu email"
						/>
						<InputField
							name="password"
							label="Senha"
							type={showPassword ? "text" : "password"}
							required={true}
							placeholder="Sua senha"
							after={
								<button
									type="button"
									className="field-icon field-button transition"
									onClick={() =>
										setShowPassword(!showPassword)
									}
								>
									{showPassword ? (
										<HiOutlineLockClosed />
									) : (
										<HiOutlineLockOpen />
									)}
								</button>
							}
						/>
						<div className="mt-8 flex justify-end space-x-4">
							{/* <Button
								type="button"
								ghost
								onClick={() =>
									setAction(
										action === "signin"
											? "signup"
											: "signin"
									)
								}
							>
								{action === "signin"
									? "Novo Usuário"
									: "Fazer Login"}
							</Button> */}
							<Button name="action" value={action} primary>
								{action === "signin" ? "Entrar" : "Criar"}
							</Button>
						</div>
					</div>
				</Form>
				<div>
					<div className="border-line mt-8 pt-8 text-center text-xs font-bold tracking-widest text-gray-300 dark:text-gray-700">
						{new Date().getFullYear()} © CNVT
					</div>
				</div>
			</div>
		</div>
	);
}
