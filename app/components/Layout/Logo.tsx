export default function Logo({
	size = 2,
	showHolding = false,
}: {
	size?: 1 | 2 | 3;
	showHolding?: boolean;
}) {
	const imageSize = size === 1 ? "h-12" : size === 2 ? "h-8" : "h-5";
	const bySize =
		size === 1
			? "text-xs"
			: size === 2
			? "text-xx"
			: "hidden sm:block text-xx";
	// return <h1 className={`font-extrabold ${imageSize} ${colors} m-0`}>STUDIO</h1>;
	return (
		<div className="flex gap-2">
			<img
				src="/logo.png"
				alt="STUDIO > Canivete"
				className={`max-w-none ${imageSize}`}
			/>
			{showHolding && (
				<div className={`font-bold leading-none ${bySize}`}>CNVT ™</div>
			)}
		</div>
	);
}
