import { flip, offset, shift, useFloating } from "@floating-ui/react-dom";
import { Popover } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { HiPlusCircle, HiStar } from "react-icons/hi";
import { isToday } from "~/utils/helpers";
import type { DayModel } from "~/utils/models";
import { scaleUp } from "~/utils/transitions";
import { ActionCalendar } from "./Action";
import AddAction from "./AddAction";

const Day = ({
	day,
	currentDate,
	viewColor,
}: {
	day: DayModel;
	currentDate: Dayjs;
	viewColor: string;
}) => {
	const { x, y, reference, floating, strategy } = useFloating({
		middleware: [offset(16), flip(), shift({ padding: 16 })],
	});

	const fetcher = useFetcher();

	return (
		<div
			className={`group flex w-full flex-col border-l border-t border-gray-200 p-2  transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50`}
			onDragOver={(event) => {
				event.stopPropagation();
				event.preventDefault();
			}}
			onDrop={(event) => {
				const draggingElement = document.querySelector(".dragging");
				const id = draggingElement?.getAttribute("data-action-id");
				const date = dayjs(
					draggingElement?.getAttribute("data-action-date")
				);
				const newDate = dayjs(
					`${day.date.format(
						"YYYY-MM-DD"
					)}T${date.hour()}:${date.minute()}:00`
				).format("YYYY-MM-DDTHH:mm:ss");
				if (id) {
					fetcher.submit(
						{
							action: "update-date",
							id,
							date: newDate,
						},
						{ method: "post" }
					);
				}
			}}
		>
			<div className={`flex items-center justify-between`}>
				{/* Número do dia */}
				<div
					className={`text-xs ${
						isToday(day.date)
							? " grid h-6 w-6 place-items-center rounded-full bg-brand font-bold text-white"
							: day.date.format("YYYY-MM") !==
							  currentDate.format("YYYY-MM")
							? "text-gray-300 dark:text-gray-700"
							: " font-semibold text-gray-500"
					}`}
				>
					{day.date.format("D")}
				</div>
				{/* Adicionar nova ação */}
				<div className="relative">
					<Popover>
						{({ open, close }) => (
							<>
								<Popover.Button
									ref={reference}
									className="text-xl text-gray-300 opacity-0 outline-none transition hover:text-gray-500 group-hover:opacity-100 dark:text-gray-700 dark:hover:text-gray-500"
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

			<div className="flex flex-shrink-0 flex-grow flex-col justify-between ">
				{/* Actions */}

				<div>
					{day.actions.map((action) => (
						<ActionCalendar
							viewColor={viewColor}
							action={action}
							key={action.id}
						/>
					))}
				</div>

				{/* Holidays */}
				<div>
					{day.holidays.map((holiday) => (
						<div
							className="text-xx flex items-center gap-1 font-semibold uppercase text-gray-400 dark:text-gray-500"
							key={holiday.id}
						>
							<span>
								<HiStar />
							</span>
							<span className="overflow-hidden text-ellipsis whitespace-nowrap tracking-wide transition group-hover:text-gray-600">
								{holiday.name}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Day;
