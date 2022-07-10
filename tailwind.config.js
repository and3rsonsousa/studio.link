/** @type {import('tailwindcss').Config} */

var colors = require("tailwindcss/colors");

module.exports = {
	content: ["./app/**/*.{ts,tsx,jsx,js}"],
	darkMode: "class",
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			},
			colors: {
				gray: colors.slate,
				brand: {
					DEFAULT: colors.violet[600],
					50: colors.violet[50],
					100: colors.violet[100],
					200: colors.violet[200],
					300: colors.violet[300],
					400: colors.violet[400],
					500: colors.violet[500],
					600: colors.violet[600],
					700: colors.violet[700],
					800: colors.violet[800],
					900: colors.violet[900],
				},
				post: colors.violet,
				reels: colors.fuchsia,
				meeting: colors.sky,
				stories: colors.amber,
				task: colors.teal,
				tiktok: colors.rose,

				idea: colors.yellow,
				do: colors.orange,
				doing: colors.rose,
				review: colors.pink,
				done: colors.purple,
				accomplished: colors.lime,
			},
		},
	},
	plugins: [],
};
