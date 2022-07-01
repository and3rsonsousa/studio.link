import type { MetaFunction } from "@remix-run/node";
import { CalendarView } from "~/components/Layout/CalendarView";

export const meta: MetaFunction = () => ({
	title: "Dashboard > STUDIO",
});

export default function () {
	return <CalendarView />;
}
