import { Form, useMatches, useOutletContext } from "@remix-run/react";
import type { AccountModel } from "~/utils/models";
import { Button, Field } from "../Forms";

export default function AddAction({ date }: { date: string }) {
	const matches = useMatches();
	const accounts: AccountModel[] = matches[1].data.accounts;
	// const options =
	// 	accounts.map((account) => ({
	// 		id: account.id,
	// 		text: account.name,
	// 		value: account.id,
	// 	}))

	return (
		<div>
			<h5 className="text-xs ">Adicionar nova ação</h5>
			<Form method="post">
				<pre>{JSON.stringify(date)}</pre>
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

				<div className="mt-4 flex justify-end">
					<Button type="submit" primary>
						Adicionar
					</Button>
				</div>
			</Form>
		</div>
	);
}
