export default function Loader({ size = 2 }: { size?: 1 | 2 | 3 }) {
	return (
		<div
			className={`animate-spin rounded-full border-gray-500/50 border-t-brand-500 dark:border-gray-500 dark:border-t-brand ${
				size === 1
					? "h-12 w-12 border-8"
					: size === 2
					? "h-10 w-10 border-[6px]"
					: "h-4 w-4 border-4"
			}`}
		></div>
	);
}
