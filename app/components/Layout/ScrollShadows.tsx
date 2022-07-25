import { useState, useEffect } from "react";

export default function ScrollShadows({
	element,
	top,
	bottom,
	topClassName,
	bottomClassName,
}: {
	element: string;
	top?: string | number;
	bottom?: string | number;
	topClassName?: string;
	bottomClassName?: string;
}) {
	const [shadowTop, setShadowTop] = useState(false);
	const [shadowBottom, setShadowBottom] = useState(false);
	useEffect(() => {
		const ele = document.querySelector(element);
		const scrollCalendar = () => {
			if (ele) {
				if (ele.scrollTop === 0) {
					setShadowTop(false);
				} else {
					setShadowTop(true);
				}
				if (ele.scrollHeight - ele.clientHeight === ele.scrollTop) {
					setShadowBottom(false);
				} else {
					setShadowBottom(true);
				}
			}
		};

		ele?.addEventListener("scroll", () => scrollCalendar());

		scrollCalendar();
	}, []);

	return (
		<>
			<div
				className={`pointer-events-none absolute left-px right-px z-10 h-12  origin-top bg-gradient-to-b from-gray-400/25 to-gray-400/0 transition dark:from-gray-900 dark:to-gray-900/0 ${
					shadowTop
						? "opacity-100 duration-500"
						: "opacity-0 duration-200"
				}${topClassName ? ` ${topClassName}` : ""}`}
				style={{ top: top || "1px" }}
			></div>
			<div
				className={`pointer-events-none absolute left-px right-px z-10 h-20  origin-bottom bg-gradient-to-t from-gray-400/50 to-gray-400/0 transition duration-500 dark:from-gray-900 dark:to-gray-900/0 ${
					shadowBottom ? "opacity-100 " : "opacity-0 "
				}${bottomClassName ? ` ${bottomClassName}` : ""}`}
				style={{ bottom: bottom || "1px" }}
			></div>
		</>
	);
}
