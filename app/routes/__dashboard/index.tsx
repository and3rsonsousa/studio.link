import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { CalendarView } from "~/components/Layout/CalendarView";
import { AccountModel } from "~/utils/models";

export const meta: MetaFunction = () => ({
	title: "Dashboard > STUDIO",
});

export default function () {
	return (
		<div>
			<CalendarView />
		</div>
	);
}
