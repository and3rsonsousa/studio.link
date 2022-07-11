import { useMatches } from "@remix-run/react";

export default function () {
	const matches = useMatches();

	return (
		<div>
			<pre>{JSON.stringify(matches, null, 2)}</pre>
		</div>
	);
}
