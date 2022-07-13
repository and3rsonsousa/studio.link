import type {
	ErrorBoundaryComponent,
	LinksFunction,
	LoaderFunction,
	MetaFunction,
} from "@remix-run/node";
import {
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
	useTransition,
} from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "./components/Layout/Loader";

// ...

import styles from "./styles/app.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
	{
		rel: "icon",
		href: "/ico.png",
	},
];

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "New Remix App",
	viewport: "width=device-width,initial-scale=1",
	description:
		"Studio é um app focado em gestão de Campanhas e Ações de Marketing criado pela empresa CANIVETE.",
});

export const loader: LoaderFunction = async () => {
	return {
		env: {
			SUPABASE_URL: process.env.SUPABASE_URL,
			SUPABASE_KEY: process.env.SUPABASE_KEY,
		},
	};
};

export default function App() {
	const transition = useTransition();

	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<AnimatePresence>
					{transition.state !== "idle" && (
						<motion.div
							className="fixed top-[18px] right-[19px] grid place-items-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							key="loader-root"
						>
							<Loader />
						</motion.div>
					)}
				</AnimatePresence>

				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
	console.error(error);
	return (
		<html>
			<head>
				<title>Oh no!</title>

				<Meta />
				<Links />
			</head>
			<body>
				<div className="grid min-h-screen place-items-center">
					<div className="text-center">
						<h1 className="text-red-500">{error.name}</h1>
						<p className="mb-8 text-xl font-semibold text-gray-900 dark:text-white">
							{error.message}
						</p>
						<pre className="whitespace-pre-wrap">{error.stack}</pre>
						<h5>
							<Link to={`/`}>de volta à Home</Link>
						</h5>
					</div>
				</div>
				<Scripts />
			</body>
		</html>
	);
};

export function CatchBoundary() {
	const caught = useCatch();
	return (
		<html>
			<head>
				<title>Oops!</title>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="grid min-h-screen place-items-center">
					<div className="text-center">
						<h1 className="text-gray-900 dark:text-white">
							<span className="text-red-600">
								{caught.status}
							</span>{" "}
							{caught.statusText}
						</h1>
						<h5 className="mt-8">
							<Link to={`/`}>de volta à Home</Link>
						</h5>
					</div>
				</div>
				<Scripts />
			</body>
		</html>
	);
}
