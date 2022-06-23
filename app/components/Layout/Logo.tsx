export default function Logo({
	color,
	size,
}: {
	color?: 1 | 2;
	size?: 1 | 2 | 3;
}) {
	const colors =
		color === 1
			? "text-white"
			: color === 2
			? "text-white/20"
			: "text-brand-600";
	const sizes =
		size === 1
			? "text-5xl tracking-wide"
			: size === 2
			? "text-3xl tracking-wider"
			: size === 3
			? "text-sm tracking-widest"
			: "text-xl tracking-wide";
	return <h1 className={`font-extrabold ${sizes} ${colors}`}>STUDIO</h1>;
}
