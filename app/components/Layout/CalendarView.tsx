import * as Popover from "@radix-ui/react-popover";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HiPlusCircle } from "react-icons/hi";
import { isThisMonth, isToday } from "~/utils/helpers";
import { scaleUp } from "~/utils/transitions";
import AddAction from "./AddAction";

export const CalendarView: React.FC = () => {
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
		<div>
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
					<Day day={day} key={day.date.format("YYYY-MM-DD")} />
				))}
			</div>
		</div>
	);
};

const Day = ({ day }: { day: { date: Dayjs } }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="group w-full px-2 py-4">
			<div
				className={`date flex items-center justify-between text-xs ${
					isToday(day.date)
						? " font-bold text-brand"
						: !isThisMonth(day.date)
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
									className="dropdown-content origin-top p-8"
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
