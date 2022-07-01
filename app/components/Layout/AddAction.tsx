import { Form, useMatches } from "@remix-run/react";
import type { AccountModel } from "~/utils/models";
import { Button, Field } from "../Forms";

export default function AddAction({ date }: { date: string }) {
	const matches = useMatches();
	const accounts: AccountModel[] = matches[1].data.accounts;

	return (
		<div className="w-96">
			<div className="border-b border-gray-700 px-8 py-4">
				<h5 className="text-xs ">Adicionar nova ação</h5>
			</div>
			<div className="px-8">
				<Form method="post">
					{/* <pre>{JSON.stringify(date)}</pre> */}
					<Field name="name" label="Nome" type="text" />
					<input name="date_start" type="hidden" value={date} />

					<Field
						name="account"
						label="Cliente"
						type="select"
						options={accounts.map((account) => ({
							id: account.id,
							text: account.name,
							value: account.id,
						}))}
					/>
				</Form>
			</div>
			<div className="mt-4 flex justify-end gap-2 border-t border-gray-700 px-8 py-4">
				<Button type="submit" primary form="add-action">
					{true ? "Adicionar" : ""}
				</Button>
			</div>
		</div>
	);
}
