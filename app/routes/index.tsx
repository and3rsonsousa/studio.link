import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import dayjs from "dayjs";
import Layout from "~/components/Layout/Layout";
import { getUser } from "~/utils/auth.server";
import { isThisMonth, isToday } from "~/utils/helpers";
import { supabaseClient } from "~/utils/supabase";

export const loader: LoaderFunction = async ({ request }) => {
	const { user, error } = await getUser(request);
	if (user) {
		const { data: person } = await supabaseClient
			.from("Person")
			.select("*")
			.eq("user", user.id)
			.single();

		return { user, person, error };
	}

	return redirect("/login");
};

export const meta: MetaFunction = () => ({
	title: "Dashboard > STUDIO",
});

export default function Index() {
	const today = dayjs();
	const firstDay = today.startOf("month").startOf("week");
	const lastDay = today.endOf("month").endOf("week");
	let current = firstDay;
	let days = [];
	while (current.isBefore(lastDay)) {
		days.push({ date: current.clone() });
		current = current.add(1, "day");
	}

	return (
		<Layout>
			<div className="mx-auto px-8 xl:container">
				<div className="border-b border-gray-800 py-2 font-bold tracking-wider">
					<div className="grid grid-cols-7">
						{["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
							(day) => (
								<div className="w-full p-2 text-xs" key={day}>
									{day}
								</div>
							)
						)}
					</div>
				</div>
				<div className="grid grid-cols-7">
					{days.map((day) => (
						<div
							className="w-full px-2 py-4"
							key={day.date.format("")}
						>
							<div
								className={`date text-xs ${
									isToday(day.date)
										? " font-bold text-brand"
										: !isThisMonth(day.date)
										? "text-gray-600"
										: " font-semibold"
								}`}
							>
								{day.date.format("D")}
							</div>
						</div>
					))}
				</div>
			</div>
		</Layout>
	);
}
