import { QueryCache, QueryClient } from "@tanstack/react-query";
import { HttpError } from "./apiCalls";

const isUnauthorized = (error: unknown) => error instanceof HttpError && error.status === 401;

export const queryClient: QueryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			// Token expiré : on repasse en anonyme, ProtectedRoute redirige vers /login
			if (isUnauthorized(error) && query.queryKey[0] !== "me") {
				queryClient.setQueryData(["me"], null);
			}
		},
	}),
	defaultOptions: {
		queries: {
			staleTime: 30_000,
			retry: (count, error) => !isUnauthorized(error) && count < 1,
		},
	},
});
