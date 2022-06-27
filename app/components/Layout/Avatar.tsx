export const Avatar = ({
	name,
	size = "lg",
}: {
	name: string;
	size?: "sm" | "md" | "lg";
}) => {
	let sizeClasses =
		size === "lg"
			? "h-12 w-12"
			: size === "md"
			? "h-8 w-8 text-xx leading-none"
			: "h-4 w-4 text-xx leading-none";
	let text = size === "sm" ? name.substring(0, 1) : name.substring(0, 3);

	return (
		<div
			className={`${sizeClasses} grid place-items-center overflow-hidden rounded-full bg-gray-800 uppercase text-gray-300`}
		>
			{text}
		</div>
	);
};
