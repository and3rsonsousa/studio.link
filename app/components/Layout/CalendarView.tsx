import { Link, useMatches, useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
	HiOutlineChevronLeft,
	HiOutlineChevronRight,
	HiOutlineClipboardCheck,
	HiOutlineTag,
} from "react-icons/hi";
import type { ActionModel } from "~/utils/models";
import Day from "./Day";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Sao_Paulo");
dayjs.locale("pt-br");

export const CalendarView = ({
	actions,
	holidays,
}: {
	actions: ActionModel[];
	holidays: ActionModel[];
}) => {
	const today = dayjs();
	const [searchParams] = useSearchParams();
	let currentDate = searchParams.get("date")
		? dayjs(searchParams.get("date"))
		: today;
	const firstDay = currentDate.startOf("month").startOf("week");
	const lastDay = currentDate.endOf("month").endOf("week");
	let current = firstDay;
	let days = [];
	while (current.isBefore(lastDay)) {
		let date = current.clone();
		days.push({
			date,
			holidays: holidays.filter(
				(h: ActionModel) =>
					dayjs(h.date).format("YYYY-MM-DD") ===
					date.format("YYYY-MM-DD")
			),
			actions: actions.filter(
				(a: ActionModel) =>
					dayjs(a.date).format("YYYY-MM-DD") ===
					date.format("YYYY-MM-DD")
			),
		});
		current = current.add(1, "day");
	}

	const viewColor = searchParams.get("color") || "status";

	return (
		<div className="flex h-full flex-col">
			<div className="flex flex-auto items-center justify-between pt-2">
				{/* Mudar mês */}
				<div className="flex items-center gap-4">
					<Link
						to={`/?date=${currentDate
							.subtract(1, "month")
							.format("YYYY-MM")}`}
						className="button button-small button-ghost text-xl"
					>
						<HiOutlineChevronLeft />
					</Link>
					<h4 className="m-0 capitalize text-gray-700 dark:text-gray-300">
						{currentDate.format("MMMM")}
					</h4>
					<Link
						to={`/?date=${currentDate
							.add(1, "month")
							.format("YYYY-MM")}`}
						className="button button-small button-ghost text-xl"
					>
						<HiOutlineChevronRight />
					</Link>
				</div>
				<div className="flex items-center text-xl">
					<Link
						to="?color=tag"
						className="button button-ghost button-icon"
					>
						<HiOutlineTag />
					</Link>
					<Link to="?color=status" className="button button-ghost">
						<HiOutlineClipboardCheck />
					</Link>
				</div>
			</div>
			<div className="mt-2 flex-auto rounded-t-xl border border-b-0 border-gray-200  py-1 font-bold tracking-wider dark:border-gray-800 ">
				<div className={`grid grid-cols-7`}>
					{["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
						(day) => (
							<div
								className="w-full p-2 text-center text-xs"
								key={day}
							>
								{day}
							</div>
						)
					)}
				</div>
			</div>
			<div
				className={`no-scroll-bars grid h-full flex-auto grid-cols-7 overflow-x-hidden rounded-b-xl border-r border-b border-gray-200 dark:border-gray-800 grid-rows-${
					days.length / 7
				}`}
			>
				{days.map((day) => (
					<Day
						day={day}
						currentDate={currentDate}
						key={day.date.format("YYYY-MM-DD")}
						viewColor={viewColor}
					/>
				))}
			</div>
		</div>
	);
};
