import * as Context from "@radix-ui/react-context-menu";
import { useFetcher, useMatches, useNavigate } from "@remix-run/react";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
	HiCheckCircle,
	HiOutlineChevronRight,
	HiOutlinePencilAlt,
	HiOutlineTrash,
} from "react-icons/hi";
import { FaExclamation } from "react-icons/fa";
import type { AccountModel, ActionModel, ItemModel } from "~/utils/models";
import { scaleUp } from "~/utils/transitions";

export const ActionCalendar = ({
	action,
	viewColor,
}: {
	action: ActionModel;
	viewColor: string;
}) => {
	const matches = useMatches();
	const navigate = useNavigate();
	const fetcher = useFetcher();
	const [dragging, setDragging] = useState(false);
	const [showContextMenu, setShowContextMenu] = useState(false);

	const { accounts } = matches[1].data;
	const { tags, status: statuses } = matches[1].data;
	const showAccount = matches[1].params.account ? true : false;

	const account: AccountModel = accounts.filter(
		(account: AccountModel) => account.id === action.account
	)[0];
	const tag: ItemModel = tags.filter(
		(tag: ItemModel) => tag.id === action.tag
	)[0];
	const status: ItemModel = statuses.filter(
		(status: ItemModel) => status.id === action.status
	)[0];

	let slug = "";

	if (viewColor === "status") {
		slug = status.slug;
	} else {
		slug = tag.slug;
	}

	const isDeleting =
		fetcher.submission &&
		fetcher.submission.formData.get("action") === "delete-action" &&
		fetcher.submission.formData.get("id") === action.id;

	const gotoActionPage = () => {
		navigate(
			`/${account.slug}/action/${action.id}/${
				window ? `?redirectTo=${encodeURI(window.location.href)}` : ""
			}`
		);
	};

	return (
		<motion.div
			draggable={true}
			// {...scaleUp()}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{
				opacity: isDeleting ? 0.2 : 1,
				scale: 1,
				transition: { duration: isDeleting ? 0.2 : 0.4 },
			}}
			exit={{
				opacity: 0,
				scale: 0.95,
				transition: { duration: 0.2 },
			}}
			onDragStart={(event) => {
				setDragging(true);
			}}
			onDragEnd={(event) => {
				setDragging(false);
			}}
			className={`transition duration-500 ${dragging ? "dragging" : ""} `}
			data-action-id={action.id}
			data-action-date={action.date}
			// style={isDeleting ? { opacity: 0.2 } : {}}
			title={action.name}
		>
			<Context.Root onOpenChange={setShowContextMenu}>
				<Context.Trigger>
					<div
						onClick={() => {
							gotoActionPage();
						}}
						className={`relative my-1 block cursor-pointer rounded transition ${slug}-bg ${slug}-bg-hover`}
					>
						{dayjs(action.date).isBefore(dayjs()) &&
						status.slug !== "accomplished" ? (
							<div className="late-action">
								<FaExclamation />
							</div>
						) : null}

						<div className="flex items-center justify-center py-1 md:justify-between md:gap-2 md:px-2">
							<div
								className={`${
									showAccount ? "hidden md:flex" : "flex"
								} items-center overflow-hidden `}
							>
								{!showAccount && (
									<div className="w-6 flex-shrink-0 text-xs font-semibold uppercase text-white md:text-[0.5rem] md:text-white/50">
										{account.name.substring(0, 3)}
									</div>
								)}

								<div className="hidden overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold md:block">
									{action.name}
								</div>
							</div>
							<div
								className={`text-xx  text-white/50 ${
									!showAccount ? "hidden md:block" : ""
								}`}
							>
								{dayjs(action.date).format(
									dayjs(action.date).minute() === 0
										? "H[h]"
										: "H[h]mm"
								)}
							</div>
						</div>
					</div>
				</Context.Trigger>
				<AnimatePresence>
					{showContextMenu && (
						<Context.Content
							className="dropdown-content w-40"
							forceMount
							asChild
						>
							<motion.div
								{...scaleUp()}
								className="dropdown-content w-40 "
							>
								<Context.Item
									className="dropdown-item flex items-center justify-between px-3 py-1"
									onClick={() => {
										gotoActionPage();
									}}
								>
									<span>Editar</span>
									<span>
										<HiOutlinePencilAlt />
									</span>
								</Context.Item>
								<Context.Item
									className="dropdown-item flex items-center justify-between px-3 py-1"
									onClick={() => {
										fetcher.submit(
											{
												action: "delete-action",
												id: action.id,
											},
											{ method: "post" }
										);
									}}
								>
									<span>Excluir</span>
									<span>
										<HiOutlineTrash />
									</span>
								</Context.Item>
								<Context.Separator className="border-line my-2" />
								<Context.Root>
									<Context.TriggerItem className="dropdown-item flex items-center justify-between px-3 py-1">
										<span>Tag</span>
										<span>
											<HiOutlineChevronRight />
										</span>
									</Context.TriggerItem>
									<Context.Content className="dropdown-content w-40">
										{tags.map((tag: ItemModel) => (
											<Context.Item
												className="dropdown-item flex w-full items-center justify-between px-3 py-1"
												key={tag.id}
												onClick={() => {
													fetcher.submit(
														{
															action: "update-tag",
															id: action.id,
															tag: tag.id,
														},
														{ method: "post" }
													);
												}}
											>
												<span className="flex items-center gap-3">
													<span
														className={`${tag.slug}-bg h-2 w-2 rounded-full`}
													></span>
													<span>{tag.name}</span>
												</span>
												{action.tag === tag.id && (
													<span>
														<HiCheckCircle />
													</span>
												)}
											</Context.Item>
										))}
									</Context.Content>
								</Context.Root>
								<Context.Root>
									<Context.TriggerItem className="dropdown-item flex items-center justify-between px-3 py-1">
										<span>Status</span>
										<span>
											<HiOutlineChevronRight />
										</span>
									</Context.TriggerItem>
									<Context.Content className="dropdown-content w-40">
										{statuses.map((status: ItemModel) => (
											<Context.Item
												className="dropdown-item flex items-center  justify-between  px-3 py-1"
												key={status.id}
												onClick={() => {
													fetcher.submit(
														{
															action: "update-status",
															id: action.id,
															status: status.id,
														},
														{ method: "post" }
													);
												}}
											>
												<span className="flex items-center gap-3">
													<span
														className={`${status.slug}-bg h-2 w-2 rounded-full`}
													></span>
													<span>{status.name}</span>
												</span>
												{action.status ===
													status.id && (
													<span>
														<HiCheckCircle />
													</span>
												)}
											</Context.Item>
										))}
									</Context.Content>
								</Context.Root>
							</motion.div>
						</Context.Content>
					)}
				</AnimatePresence>
			</Context.Root>
		</motion.div>
	);
};
