import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { CalendarView } from "~/components/Layout/CalendarView";
import { createAction, deleteAction, updateAction } from "~/utils/data.server";

export const meta: MetaFunction = () => ({
	title: "Dashboard > STUDIO",
});

export default function () {
	return <CalendarView />;
}

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const action = formData.get("action") as string;

	if (action === "create") {
		return await createAction(formData);
	} else if (action.match(/update-/)) {
		const id = formData.get("id") as string;
		let values = {};
		if (action === "update-tag") {
			values = { tag: formData.get("tag") as string };
		} else if (action === "update-status") {
			values = { status: formData.get("status") as string };
		} else if (action === "update-date") {
			values = { date: formData.get("date") as string };
		}
		return await updateAction(id, values);
	} else if (action === "delete") {
		const id = formData.get("id") as string;
		return await deleteAction(id);
	}

	return false;
};
