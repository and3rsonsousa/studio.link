import { flip, offset, shift, useFloating } from "@floating-ui/react-dom";
import { Popover } from "@headlessui/react";
import { Link, useMatches, useSearchParams } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { AnimatePresence, motion } from "framer-motion";
import {
	HiOutlineChevronLeft,
	HiOutlineChevronRight,
	HiPlusCircle,
	HiStar,
} from "react-icons/hi";
import { isToday } from "~/utils/helpers";
import type { ActionModel, DayModel } from "~/utils/models";
import { scaleUp } from "~/utils/transitions";
import { ActionCalendar } from "./Action";
import AddAction from "./AddAction";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Sao_Paulo");
dayjs.locale("pt-br");

export const CalendarView: React.FC = () => {
	const matches = useMatches();
	const { actions } = matches[1].data;

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
			holidays: actions.filter(
				(h: ActionModel) =>
					dayjs(h.date).format("YYYY-MM-DD") ===
						date.format("YYYY-MM-DD") && h.account === null
			),
			actions: actions.filter(
				(a: ActionModel) =>
					dayjs(a.date).format("YYYY-MM-DD") ===
						date.format("YYYY-MM-DD") && a.account !== null
			),
		});
		current = current.add(1, "day");
	}

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
			</div>
			<div className="mt-2 flex-auto rounded-t-xl border border-b-0 border-gray-200 bg-gray-50 py-1 font-bold tracking-wider dark:border-gray-800 dark:bg-gray-800">
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
				className={`grid h-full flex-auto grid-cols-7 overflow-x-hidden rounded-b-xl border-r border-b border-gray-200 dark:border-gray-800 grid-rows-${
					days.length / 7
				}`}
			>
				{days.map((day) => (
					<Day
						day={day}
						currentDate={currentDate}
						key={day.date.format("YYYY-MM-DD")}
					/>
				))}
			</div>
		</div>
	);
};

const Day = ({ day, currentDate }: { day: DayModel; currentDate: Dayjs }) => {
	const { x, y, reference, floating, strategy } = useFloating({
		middleware: [offset(16), flip(), shift({ padding: 16 })],
	});
	return (
		<div className="group w-full border-l border-t border-gray-200 p-2 transition hover:bg-gray-50 dark:border-gray-800">
			<div className={`flex items-center justify-between`}>
				<div
					className={`text-xs ${
						isToday(day.date)
							? " font-bold text-brand"
							: day.date.format("YYYY-MM") !==
							  currentDate.format("YYYY-MM")
							? "text-gray-600"
							: " font-semibold"
					}`}
				>
					{day.date.format("D")}
				</div>
				<div className="relative">
					<Popover>
						{({ open, close }) => (
							<>
								<Popover.Button
									ref={reference}
									className="text-xl text-gray-700 opacity-0 outline-none transition hover:text-gray-500 group-hover:opacity-100"
								>
									<HiPlusCircle />
								</Popover.Button>
								<AnimatePresence
									key={day.date.format("YYYY-MM-DD")}
								>
									{open && (
										<Popover.Panel
											static
											className={`dropdown-content z-[999] `}
											as={motion.div}
											ref={floating}
											style={{
												top: y ?? 0,
												left: x ?? 0,
												position: strategy,
											}}
											{...scaleUp()}
										>
											<AddAction
												date={day.date.format(
													"YYYY-MM-DD hh:mm"
												)}
											/>
										</Popover.Panel>
									)}
								</AnimatePresence>
							</>
						)}
					</Popover>
				</div>
			</div>
			<div>
				{/* Holidays */}
				<div>
					{day.holidays.map((holiday) => (
						<div
							className="text-xx flex items-center gap-1 font-semibold uppercase text-gray-300"
							key={holiday.id}
						>
							<span>
								<HiStar />
							</span>
							<span className="overflow-hidden text-ellipsis whitespace-nowrap tracking-wide">
								{holiday.name}
							</span>
						</div>
					))}
				</div>

				{/* Actions */}

				<div>
					{day.actions.map((action) => (
						<ActionCalendar action={action} key={action.id} />
					))}
				</div>
			</div>
		</div>
	);
};
