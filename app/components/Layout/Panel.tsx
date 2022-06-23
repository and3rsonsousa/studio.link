import { AnimatePresence, motion } from "framer-motion";
import useMeasure from "react-use-measure";

const Panel: React.FC<{
	panelClassName?: string;
	contentClassName?: string;
	duration?: number;
	id?: string;
	useHeight?: true;
	useWidth?: true;
	delay?: number;
}> = ({
	children,
	duration = 1,
	panelClassName,
	contentClassName,
	id,
	useHeight = true,
	useWidth,
	delay,
}) => {
	let [ref, { height, width }] = useMeasure();
	id = id || JSON.stringify(children, ignoreCircularReferences());

	return (
		<motion.div
			animate={{
				height: useHeight ? height || "auto" : "auto",
				width: useWidth ? width || "auto" : "auto",
				transition: { duration },
			}}
			className={`${panelClassName} relative overflow-hidden`}
		>
			<AnimatePresence initial={false}>
				<motion.div
					key={id}
					initial={{ opacity: 0 }}
					animate={{
						opacity: 1,
						transition: {
							duration: duration / 2,
							delay: delay ?? duration / 2,
						},
					}}
					exit={{
						opacity: 0,
						transition: { duration: duration / 2 },
					}}
				>
					<div
						ref={ref}
						className={`${
							height || width
								? `absolute ${!useWidth ? " w-full " : ""}`
								: "relative"
						} ${contentClassName}`}
					>
						{children}
					</div>
				</motion.div>
			</AnimatePresence>
		</motion.div>
	);
};

export default Panel;

const ignoreCircularReferences = () => {
	const seen = new WeakSet();
	return (key: string, value: any) => {
		if (key.startsWith("_")) return; // Don't compare React's internal props.
		if (typeof value === "object" && value !== null) {
			if (seen.has(value)) return;
			seen.add(value);
		}
		return value;
	};
};
