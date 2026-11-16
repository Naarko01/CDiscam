import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMe, login, logout } from "../lib/apiCalls";

export const ME_KEY = ["me"] as const;

export function useAuth() {
	const { data: user, isPending } = useQuery({
		queryKey: ME_KEY,
		queryFn: fetchMe,
		staleTime: Infinity,
		retry: false,
		refetchOnWindowFocus: true,
	});
	return { user: user ?? null, isLoading: isPending, isAuthenticated: !!user };
}

export function useLogin() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: login,
		onSuccess: (user) => queryClient.setQueryData(ME_KEY, user),
	});
}

export function useLogout() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== ME_KEY[0] });
			queryClient.setQueryData(ME_KEY, null);
		},
	});
}

export default useAuth;
