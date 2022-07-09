export const scaleUp = (duration = 0.2, exitFactor = 0.5) => ({
	initial: { opacity: 0, scale: 0.95 },
	animate: {
		opacity: 1,
		scale: 1,
		transition: { duration },
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: duration * exitFactor },
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
