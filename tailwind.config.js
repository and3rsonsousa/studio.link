/** @type {import('tailwindcss').Config} */

var colors = require("tailwindcss/colors");

module.exports = {
	content: ["./app/**/*.{ts,tsx,jsx,js}"],
	theme: {
		extend: {
			colors: {
				gray: colors.slate,
				brand: {
					DEFAULT: colors.indigo[600],
					50: colors.indigo[50],
					100: colors.indigo[100],
					200: colors.indigo[200],
					300: colors.indigo[300],
					400: colors.indigo[400],
					500: colors.indigo[500],
					600: colors.indigo[600],
					700: colors.indigo[700],
					800: colors.indigo[800],
					900: colors.indigo[900],
				},
				post: colors.indigo,
				meeting: colors.blue,
				stories: colors.teal,
				todo: colors.green,
				tiktok: colors.lime,
				idea: colors.yellow,
				do: colors.orange,
				doing: colors.rose,
				review: colors.pink,
				done: colors.violet,
				accomplished: colors.purple,
			},
		},
	},
	plugins: [],
};
