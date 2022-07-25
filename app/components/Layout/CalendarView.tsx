import { Link, useMatches, useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {
	HiOutlineChevronLeft,
	HiOutlineChevronRight,
	HiOutlineClipboardCheck,
	HiOutlineTag,
} from "react-icons/hi";
import type { ActionModel } from "~/utils/models";
import Day from "./Day";
import { useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
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
						date.format("YYYY-MM-DD") && a.date_end === null
			),
			// actionsWithEndDate: actions.filter((a: ActionModel) => {
			// 	if (a.date_end) {
			// 		console.log(
			// 			date.format("YYYY-MM-DD"),
			// 			" ",
			// 			a.date,
			// 			" ",
			// 			a.date_end
			// 		);
			// 	}

			// 	return (
			// 		a.date_end !== null &&
			// 		date.isSameOrAfter(dayjs(a.date)) &&
			// 		date.isSameOrBefore(dayjs(a.date_end))
			// 	);
			// }),
		});
		current = current.add(1, "day");
	}

	const [shadowTop, setShadowTop] = useState(false);
	const [shadowBottom, setShadowBottom] = useState(false);
	const viewColor = searchParams.get("color") || "status";

	useEffect(() => {
		const ele = document.querySelector(".calendar-days");
		const scrollCalendar = (ele: Element | null) => {
			if (ele) {
				if (ele.scrollTop === 0) {
					setShadowTop(false);
				} else {
					setShadowTop(true);
				}
				if (ele.scrollHeight - ele.clientHeight === ele.scrollTop) {
					setShadowBottom(false);
				} else {
					setShadowBottom(true);
				}
			}
		};

		ele?.addEventListener("scroll", () => scrollCalendar(ele));

		scrollCalendar(ele);
	}, []);

	return (
		<div className="relative flex h-full flex-col">
			<div className="flex flex-auto items-center justify-between pt-2">
				{/* Mudar mês */}
				<div className="flex items-center gap-4">
					<Link
						to={`?date=${currentDate
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
						to={`?date=${currentDate
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

			<div className="mt-2 flex-auto rounded-t-xl border border-b  border-gray-200 py-1 font-bold tracking-wider shadow-gray-500/50 dark:border-gray-800 ">
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
				className={`calendar-days no-scroll-bars -mt-px grid h-full flex-auto grid-cols-7 overflow-x-hidden rounded-b-xl border-r border-b border-gray-200 dark:border-gray-800 grid-rows-${
					days.length / 7
				} z-100 relative`}
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
			<div
				className={`pointer-events-none absolute top-[101px] left-px right-px z-10 h-12  origin-top bg-gradient-to-b from-gray-400/25 to-gray-400/0 transition dark:from-black/75 dark:to-black/0 ${
					shadowTop
						? "opacity-100 duration-500"
						: "opacity-0 duration-200"
				}`}
			></div>
			<div
				className={`pointer-events-none absolute bottom-0 left-px right-px z-10 h-20  origin-bottom rounded-b-xl bg-gradient-to-t from-gray-400/50 to-gray-400/0 transition duration-500 dark:from-black/50 dark:to-black/0 ${
					shadowBottom ? "opacity-100 " : "opacity-0 "
				}`}
			></div>
		</div>
	);
};
