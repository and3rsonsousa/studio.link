import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { CalendarView } from "~/components/Layout/CalendarView";
import { createAction } from "~/utils/data.server";

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
	}

	return false;
};
