import { Link, useMatches } from "@remix-run/react";
import dayjs from "dayjs";
import type { AccountModel, ActionModel, ItemModel } from "~/utils/models";

export const ActionCalendar = ({ action }: { action: ActionModel }) => {
	const matches = useMatches();
	const { accounts, tags, status: statuses } = matches[1].data;
	const account = accounts.filter(
		(account: AccountModel) => account.id === action.account
	)[0];
	const tag: ItemModel = tags.filter(
		(tag: ItemModel) => tag.id === action.tag
	)[0];
	const status: ItemModel = statuses.filter(
		(status: ItemModel) => status.id === action.status
	)[0];

	return (
		<Link
			to={`/actions/${action.id}`}
			className={`relative my-1 block cursor-pointer rounded px-2 py-1 transition ${status.slug}-bg ${status.slug}-bg-hover`}
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
		</Link>
	);
};
