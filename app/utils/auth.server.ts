import { redirect } from "@remix-run/node";
import { commitSession, destroySession, getSession } from "./session.server";
import { supabaseClient } from "./supabase";

export async function signUP(
	email: string,
	password: string,
	name: string,
	request: Request
) {
	await supabaseClient.auth.signOut();

	const {
		user,
		error,
		session: sessionSupabase,
	} = await supabaseClient.auth.signUp({ email, password });

	if (user && !error) {
		const { error: person_error } = await supabaseClient
			.from("Person")
			.insert([{ name, email, admin: true, user: user.id }]);

		if (!person_error) {
			let sessionRemix = await getSession(request.headers.get("Cookie"));
			sessionRemix.set("access_token", sessionSupabase?.access_token);
			return redirect("/", {
				headers: {
					"Set-Cookie": await commitSession(sessionRemix),
				},
			});
		} else {
			return { error: person_error };
		}
	} else {
		return { user, error };
	}
}

export async function signIN(
	email: string,
	password: string,
	request: Request
) {
	const {
		user,
		session: sessionSupabase,
		error,
	} = await supabaseClient.auth.signIn({
		email,
		password,
	});

	if (user && !error) {
		let sessionRemix = await getSession(request.headers.get("Cookie"));
		sessionRemix.set("access_token", sessionSupabase?.access_token);

		return redirect("/", {
			headers: {
				"Set-Cookie": await commitSession(sessionRemix),
			},
		});
	}

	return { user, error };
}

export async function signOUT(request: Request) {
	await supabaseClient.auth.signOut();
	const session = await getSession(request.headers.get("Cookie"));
	return redirect("/login", {
		headers: {
			"Set-Cookie": await destroySession(session),
		},
	});
}

export async function getUser(request: Request) {
	const redirectTo = new URL(request.url).pathname;

	const session = await getSession(request.headers.get("Cookie"));

	// Caso não esteja logado
	if (!session.has("access_token")) {
		let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
		throw redirect(`/login?${searchParams}`);
	} else {
		// Caso esteja logado
		const { user, error } = await supabaseClient.auth.api.getUser(
			session.get("access_token")
		);

		if (error) {
			return { user, error };
		}
		supabaseClient.auth.setAuth(session.get("access_token"));
		return { user, error };
	}
}
