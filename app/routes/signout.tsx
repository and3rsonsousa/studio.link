import type { LoaderFunction } from "@remix-run/node";
import { signOUT } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
	return await signOUT(request);
};
