export default function Logo({ size = 2 }: { size?: 1 | 2 | 3 }) {
	const sizes = size === 1 ? "h-12" : size === 2 ? "h-8" : "h-5";
	// return <h1 className={`font-extrabold ${sizes} ${colors} m-0`}>STUDIO</h1>;
	return (
		<img
			src="/logo.png"
			alt="STUDIO > Canivete"
			className={`max-w-none ${sizes}`}
		/>
	);
}
