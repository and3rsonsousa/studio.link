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
import type {
	AccountModel,
	ActionModel,
	DayModel,
	ItemModel,
} from "~/utils/models";
import { scaleUp } from "~/utils/transitions";
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
					<h4 className="m-0 capitalize text-gray-300">
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
				className={`grid h-full flex-auto grid-cols-7 border-r border-gray-800 grid-rows-${
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
		<div className="group w-full border-l border-b border-gray-800 p-2 transition hover:bg-gray-700/10">
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

const ActionCalendar = ({ action }: { action: ActionModel }) => {
	const matches = useMatches();
	const { accounts, tags, status: statuses } = matches[1].data;
	const account = accounts.filter(
		(account: AccountModel) => account.id === action.account
	)[0];
	const tag = tags.filter((tag: ItemModel) => tag.id === action.tag)[0];
	const status = statuses.filter(
		(status: ItemModel) => status.id === action.status
	)[0];

	return (
		<div
			className={`my-1 rounded  px-2 py-1 transition ${status.slug}-bg ${status.slug}-bg-hover`}
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center overflow-hidden">
					<div className="w-6 flex-shrink-0 text-[0.5rem] font-semibold uppercase text-white/50">
						{account.name.substring(0, 3)}
					</div>

					<div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold ">
						{action.name}
					</div>
				</div>
				<div className="text-xx text-white/50">
					{dayjs(action.date).format(
						dayjs(action.date).minute() === 0 ? "H[h]" : "H[h]mm"
					)}
				</div>
			</div>
		</div>
	);
};

// d90224a7-abf2-4bc7-be60-e5d165a6a37a

// 5c5986ed-7ba6-4b7f-9f69-e47bf6cf5ac4
