import { useMatches } from "@remix-run/react";
import type { ActionModel, ItemModel } from "~/utils/models";

export default function () {
	const matches = useMatches();

	const { tags } = matches[1].data;
	const { actions } = matches[3].data;

	const gridTags = tags.filter(
		(tag: ItemModel) => tag.slug === "post" || tag.slug === "reels"
	);

	let filtered: ActionModel[] = actions.filter(
		(action: ActionModel) =>
			gridTags.filter((tag: ItemModel) => tag.id === action.tag).length >
			0
	);

	if (filtered.length % 3 !== 0) {
		filtered.push({
			id: new Date().toDateString(),
			date: "",
			name: "support",
		});
	}
	filtered = filtered.reverse();

	return (
		<div className="mt-4 w-1/3">
			<h3 className=" mb-3 text-gray-700 dark:text-gray-300">Grid</h3>
			<div className="overflow-hidden rounded-xl border dark:border-gray-800">
				<div className="p-2">ok</div>
				<div className="grid grid-cols-3 ">
					{filtered.map((action: ActionModel, index: number) =>
						action.name === "support" ? (
							<div
								key={action.id}
								className={`border-t bg-gray-50 dark:border-gray-800 ${
									(index + 1) % 3 !== 0 ? "border-r" : ""
								}`}
							></div>
						) : (
							<div
								className={`border-t dark:border-gray-800 ${
									(index + 1) % 3 !== 0 ? "border-r" : ""
								} relative flex aspect-square flex-col place-items-center justify-between p-2 `}
								key={action.id}
							>
								<div className="text-xx">
									{/* {dayjs(action.date).format("D")} */}
								</div>
								<div className="text-center text-xs font-medium">
									{action.name}
								</div>
								<div></div>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
}
