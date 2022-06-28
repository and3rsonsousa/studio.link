export const scaleUp = (duration?: number) => ({
	initial: { opacity: 0, scale: 0.95 },
	animate: {
		opacity: 1,
		scale: 1,
		transition: { duration: duration || 0.2 },
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: duration ? duration / 2 : 0.1 },
	},
});

// const dropdownAnimations = {
// 	initial: { opacity: 0, scale: 0.9 },
// 	animate: {
// 		opacity: 1,
// 		scale: 1,
// 		transition: { ease: "circOut", duration: 0.2 },
// 	},
// 	exit: {
// 		opacity: 0,
// 		scale: 0.9,
// 		transition: { ease: "circOut", duration: 0.2 },
// 	},
// };
