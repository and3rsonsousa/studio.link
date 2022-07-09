import * as Context from "@radix-ui/react-context-menu";
import { Link, useFetcher, useMatches, useNavigate } from "@remix-run/react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
	HiCheckCircle,
	HiOutlineChevronRight,
	HiOutlinePencilAlt,
	HiOutlineTrash,
} from "react-icons/hi";
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
	const { accounts, tags, status: statuses } = matches[1].data;
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

	const navigate = useNavigate();
	const fetcher = useFetcher();
	const [dragging, setDragging] = useState(false);
	const isDeleting =
		fetcher.submission &&
		fetcher.submission.formData.get("action") === "delete-action" &&
		fetcher.submission.formData.get("id") === action.id;

	return (
		<motion.div
			draggable={true}
			{...scaleUp()}
			onDragStart={(event) => {
				setDragging(true);
			}}
			onDragEnd={(event) => {
				setDragging(false);
			}}
			className={`transition duration-500 ${dragging ? "dragging" : ""} `}
			data-action-id={action.id}
			data-action-date={action.date}
		>
			<Context.Root>
				<Context.Trigger>
					<div
						// to={`/actions/${action.id}`}
						className={`relative my-1 block cursor-pointer rounded transition ${slug}-bg ${slug}-bg-hover`}
					>
						{/* <div
				className={`l-0 t-0 absolute h-full w-[4px] rounded-l-xl ${tag.slug}-bg`}
			></div> */}
						<div className="flex items-center justify-between gap-2 px-2 py-1">
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
									dayjs(action.date).minute() === 0
										? "H[h]"
										: "H[h]mm"
								)}
							</div>
						</div>
					</div>
				</Context.Trigger>
				<Context.Content className="dropdown-content w-40 py-2">
					{/* <div className="py-2">
					<div className="px-6 font-medium leading-none text-gray-700">
						{action.name}
					</div>
					<div className="text-xx px-6">
						{dayjs(action.date).format("DD [de] MMMM [de] YYYY")}
					</div>
				</div>
				<Context.Separator className="border-line" /> */}
					<Context.Item
						className="dropdown-item flex items-center justify-between px-3 py-1"
						onClick={() => {
							navigate(`/${account.slug}/action/${action.id}`);
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
								{ action: "delete-action", id: action.id },
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
						<Context.Content className="dropdown-content w-40  py-2">
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
						<Context.Content className="dropdown-content w-40 py-2">
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
									{action.status === status.id && (
										<span>
											<HiCheckCircle />
										</span>
									)}
								</Context.Item>
							))}
						</Context.Content>
					</Context.Root>
				</Context.Content>
			</Context.Root>
		</motion.div>
	);
};
