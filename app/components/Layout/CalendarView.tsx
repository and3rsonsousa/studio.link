import * as Popover from "@radix-ui/react-popover";
import { Link, useSearchParams } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
	HiOutlineChevronLeft,
	HiOutlineChevronRight,
	HiPlusCircle,
} from "react-icons/hi";
import { isThisMonth, isToday } from "~/utils/helpers";
import { scaleUp } from "~/utils/transitions";
import AddAction from "./AddAction";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Sao_Paulo");
dayjs.locale("pt-br");

export const CalendarView: React.FC = () => {
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
		days.push({ date: current.clone() });
		current = current.add(1, "day");
	}

	console.log(dayjs(searchParams.get("date")));

	return (
		<div className="flex h-full flex-col">
			<div className="flex flex-auto items-center justify-between pt-2">
				{/* Mudar mês */}
				<div className="flex items-center gap-4">
					<Link
						to={`/?date=${currentDate
							.subtract(1, "month")
							.format("YYYY-MM")}`}
						className="button button-small text-xl"
					>
						<HiOutlineChevronLeft />
					</Link>
					<h4 className="m-0 capitalize text-gray-300">
						{currentDate.format("MMMM")}
					</h4>
					<Link
						to={`/?date=${currentDate
							.add(1, "month")
							.format("YYYY-MM")}`}
						className="button button-small text-xl"
					>
						<HiOutlineChevronRight />
					</Link>
				</div>
			</div>
			<div className="flex-auto border-b border-gray-800 py-2 font-bold tracking-wider">
				<div className={`grid grid-cols-7`}>
					{["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map(
						(day) => (
							<div className="w-full p-2 text-xs" key={day}>
								{day}
							</div>
						)
					)}
				</div>
			</div>
			<div
				className={`grid h-full flex-auto grid-cols-7 grid-rows-${
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

const Day = ({
	day,
	currentDate,
}: {
	day: { date: Dayjs };
	currentDate: Dayjs;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="group w-full px-2 py-4">
			<div
				className={`date flex items-center justify-between text-xs ${
					isToday(day.date)
						? " font-bold text-brand"
						: day.date.format("YYYY-MM") !==
						  currentDate.format("YYYY-MM")
						? "text-gray-600"
						: " font-semibold"
				}`}
			>
				<div>{day.date.format("D")}</div>
				<div>
					<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
						<Popover.Trigger className="text-xl text-gray-700 opacity-0 transition hover:text-gray-500 group-hover:opacity-100">
							<HiPlusCircle />
						</Popover.Trigger>
						<AnimatePresence key={day.date.format("YYYY-MM-DD")}>
							{isOpen && (
								<Popover.Content
									forceMount
									className="dropdown-content origin-top"
									sideOffset={10}
									asChild
								>
									<motion.div {...scaleUp()}>
										<AddAction
											date={day.date.format(
												"YYYY-MM-DD hh:mm"
											)}
										/>
									</motion.div>
								</Popover.Content>
							)}
						</AnimatePresence>
					</Popover.Root>
				</div>
			</div>
		</div>
	);
};
