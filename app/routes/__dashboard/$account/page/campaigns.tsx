import { Form, useMatches } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { HiOutlinePlus, HiOutlineX } from "react-icons/hi";
import { Button, InputField } from "~/components/Forms";
import TextareaField from "~/components/Forms/TextareaField";
import Panel from "~/components/Layout/Panel";

export default function () {
	const matches = useMatches();
	const { campaigns } = matches[3].data;
	const [showForm, setShowForm] = useState(false);

	return (
		<div className="mt-4 w-1/3">
			<div className="flex items-center justify-between">
				<h3 className=" mb-3 text-gray-700 dark:text-gray-300">
					Campanhas
				</h3>
				<Button onClick={() => setShowForm(!showForm)}>
					<motion.div animate={{ rotate: showForm ? 45 : 0 }}>
						<HiOutlinePlus />
					</motion.div>
				</Button>
			</div>
			<Panel contentClassName="p-2 -m-1">
				{showForm && (
					<Form method="post">
						<InputField
							name="name"
							label="Nome"
							type="text"
							required
						/>
						<TextareaField name="description" label="Descrição" />
						<input type="hidden" name="account" value="" />
						<input type="hidden" name="creator" value="" />
						<div>Actions</div>
						<InputField
							name="date_start"
							label="Data de início"
							type="datetime-local"
							required
						/>
						<InputField
							name="date_end"
							label="Data de início"
							type="datetime-local"
							required
						/>
					</Form>
				)}
			</Panel>
			{campaigns ? (
				<div></div>
			) : (
				<div className="py-4 text-sm">Nenhuma Campanha encontrada</div>
			)}
			<div></div>
		</div>
	);
}
