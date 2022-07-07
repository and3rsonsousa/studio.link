import { GraphQLClient } from "graphql-request";
import { supabaseClient } from "./supabase.server";

export const client = new GraphQLClient(
	`${process.env.SUPABASE_URL}/graphql/v1`,
	{
		headers: {
			authorization: `Bearer ${
				supabaseClient.auth.session()?.access_token
			}`,
		},
	}
);
